import express from "express";
import { PrismaClient } from "@prisma/client";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { v4 as uuidv4 } from "uuid";
import Stripe from "stripe";
import PDFDocument from "pdfkit";
import QRCode from "qrcode";

const router = express.Router();
const prisma = new PrismaClient();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

router.post("/purchase", authMiddleware, async (req, res) => {
  const userId = req.user.id;
  const { ticketTypeId, validDate, quantity } = req.body;

  if (!ticketTypeId || !validDate || quantity < 1) {
    return res.status(400).json({ error: "Dati mancanti o invalidi" });
  }

  try {
    const tickets = await Promise.all(
      Array.from({ length: quantity }).map(() =>
        prisma.ticket.create({
          data: {
            userId,
            typeId: ticketTypeId,
            validDate: new Date(validDate),
            qrCode: `QR-${uuidv4()}`,
          },
        })
      )
    );

    res.json({ success: true, tickets });
  } catch (error) {
    console.error("Errore acquisto ticket:", error);
    res.status(500).json({ error: "Errore durante l'acquisto" });
  }
});

router.get("/types", async (req, res) => {
  try {
    const types = await prisma.ticketType.findMany({
      orderBy: { price: "asc" },
    });
    res.json(types);
  } catch (error) {
    console.error("Errore nel recupero tipi di biglietto:", error);
    res.status(500).json({ error: "Errore nel recupero tipi di biglietto" });
  }
});

router.post("/checkout", authMiddleware, async (req, res) => {
  const { ticketTypeId, quantity, validDate } = req.body;
  const userId = req.user.id;

  const ticketType = await prisma.ticketType.findUnique({
    where: { id: ticketTypeId },
  });
  if (!ticketType)
    return res.status(404).json({ error: "Biglietto non trovato" });

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    mode: "payment",
    line_items: [
      {
        quantity,
        price_data: {
          currency: "eur",
          unit_amount: Math.round(ticketType.price * 100),
          product_data: {
            name: ticketType.name,
            description: ticketType.description,
          },
        },
      },
    ],
    customer_creation: "always",
    customer_email: req.user.email,
    success_url:
      "http://localhost:5173/success?session_id={CHECKOUT_SESSION_ID}",
    cancel_url: `${process.env.FRONTEND_URL}/tickets`,
    metadata: {
      userId: String(userId),
      ticketTypeId: String(ticketTypeId),
      quantity: String(quantity),
      validDate: validDate,
    },
    phone_number_collection: {
      enabled: true,
    },
  });

  res.json({ url: session.url });
});

// endpoint per recuperare i dettagli del pagamento completato
router.get("/payment-success/:sessionId", async (req, res) => {
  try {
    const { sessionId } = req.params;

    // Recupera la sessione da Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ["payment_intent", "payment_intent.payment_method", "customer"],
    });

    const customerDetails = session.customer_details || {};

    const buyer = {
      name: customerDetails.name || null,
      email: customerDetails.email || null,
      phone: customerDetails.phone || null,
    };

    if (!session || session.payment_status !== "paid") {
      return res.status(400).json({ error: "Pagamento non completato" });
    }

    const userId = parseInt(session.metadata.userId, 10);
    // Verifica che l'utente sia autorizzato
    if (session.metadata.userId !== userId.toString()) {
      return res.status(403).json({ error: "Non autorizzato" });
    }

    // Crea i biglietti se non esistono già
    const existingTickets = await prisma.ticket.findMany({
      where: {
        userId: userId,
        stripeSessionId: sessionId,
      },
      include: {
        type: true,
      },
    });

    let tickets = existingTickets;

    if (tickets.length === 0) {
      // Crea i biglietti
      const { ticketTypeId, quantity, validDate } = session.metadata;

      tickets = await Promise.all(
        Array.from({ length: Number.parseInt(quantity) }).map(() =>
          prisma.ticket.create({
            data: {
              userId,
              typeId: Number.parseInt(ticketTypeId),
              validDate: new Date(validDate),
              qrCode: `EP-${Date.now()}-${userId}-${Math.random()
                .toString(36)
                .substr(2, 9)}`,
              stripeSessionId: sessionId,
              status: "active",
              buyerName: customerDetails.name || null,
              buyerEmail: customerDetails.email || null,
              buyerPhone: customerDetails.phone || null,
            },
            include: {
              type: true,
            },
          })
        )
      );
    }

    // Prepara i dati del pagamento
    const paymentData = {
      id: session.payment_intent.id,
      amount_total: session.amount_total,
      currency: session.currency,
      created: session.payment_intent.created,
      status: session.payment_intent.status,
      card: session.payment_intent.payment_method
        ? {
            brand: session.payment_intent.payment_method.card?.brand,
            last4: session.payment_intent.payment_method.card?.last4,
            funding: session.payment_intent.payment_method.card?.funding,
          }
        : null,
    };

    res.json({
      payment: paymentData,
      buyer,
      tickets: tickets,
    });
  } catch (error) {
    console.error("Errore nel recupero dettagli pagamento:", error);
    res.status(500).json({ error: "Errore interno del server" });
  }
});

router.get("/:id/download", authMiddleware, async (req, res) => {
  try {
    const ticketId = Number.parseInt(req.params.id);
    const userId = req.user.id;

    const ticket = await prisma.ticket.findFirst({
      where: { id: ticketId, userId },
      include: { type: true, user: true },
    });

    if (!ticket) {
      return res.status(404).json({ error: "Biglietto non trovato" });
    }

    // Genera QR code come base64
    const qrCodeDataUrl = await QRCode.toDataURL(ticket.qrCode, {
      width: 300,
      margin: 1,
      color: {
        dark: "#000000",
        light: "#ffffff",
      },
    });

    const base64Data = qrCodeDataUrl.replace(/^data:image\/png;base64,/, "");
    const qrImageBuffer = Buffer.from(base64Data, "base64");

    const doc = new PDFDocument({ size: "A4", margin: 50 });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=biglietto-${ticket.id}.pdf`
    );

    doc.pipe(res);

    doc.fontSize(20).text("HI. - Biglietto", { align: "center" });
    doc.moveDown();

    doc.fontSize(14).text(`Numero Biglietto: ${ticket.id}`);
    doc.text(`Nome: ${ticket.buyerName}`);
    doc.text(`Email: ${ticket.buyerEmail}`);
    doc.text(`Telefono: ${ticket.buyerPhone}`);
    doc.text(
      `Data visita: ${new Date(ticket.validDate).toLocaleDateString("it-IT")}`
    );
    doc.text(`Tipo biglietto: ${ticket.type.name}`);
    doc.text(`Prezzo: € ${ticket.type.price.toFixed(2)}`);
    doc.text(`Codice QR: ${ticket.qrCode}`);

    doc.moveDown();

    //immagine QR code
    doc.image(qrImageBuffer, {
      fit: [150, 150],
      align: "center",
      valign: "center",
    });

    doc.moveDown();
    doc.text("Presenta questo biglietto all'ingresso del parco.", {
      align: "center",
      italics: true,
    });

    doc.end();
  } catch (error) {
    console.error("Errore download biglietto:", error);
    res.status(500).json({ error: "Errore nella generazione del PDF" });
  }
});

router.get("/my", authMiddleware, async (req, res) => {
  const userId = req.user.id;

  try {
    const tickets = await prisma.ticket.findMany({
      where: { userId },
      include: { type: true },
      orderBy: { validDate: "desc" },
    });

    res.json(tickets);
  } catch (error) {
    console.error("Errore nel recupero biglietti utente:", error);
    res.status(500).json({ error: "Errore nel recupero biglietti" });
  }
});

export default router;
