import express from "express";
import { PrismaClient } from "@prisma/client";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const prisma = new PrismaClient();
const router = express.Router();

// GET tutti i planner dell’utente
router.get("/", authMiddleware, async (req, res) => {
  const userId = req.user.id;

  const planners = await prisma.dailyPlan.findMany({
    where: { userId },
    include: {
      items: {
        include: {
          attraction: true,
          showSchedule: {
            include: { show: true },
          },
        },
      },
    },
    orderBy: { date: "asc" },
  });

  res.json(planners);
});

// POST aggiungi voce al planner
router.post("/add", authMiddleware, async (req, res) => {
  const userId = req.user.id;
  const { date, attractionId, showScheduleId, preferredTime } = req.body;

  if (!attractionId && !showScheduleId) {
    return res
      .status(400)
      .json({ error: "Serve attractionId o showScheduleId" });
  }

  const parsedDate = new Date(date);

  let plan = await prisma.dailyPlan.findFirst({
    where: { userId, date: parsedDate },
  });

  if (!plan) {
    plan = await prisma.dailyPlan.create({
      data: { userId, date: parsedDate },
    });
  }

  const newItem = await prisma.dailyPlanItem.create({
    data: {
      planId: plan.id,
      attractionId: attractionId || null,
      showScheduleId: showScheduleId || null,
      preferredTime: preferredTime ? new Date(preferredTime) : null,
    },
  });

  res.json({ success: true, item: newItem });
});

//DELETE rimuovi planner

router.delete("/:id", authMiddleware, async (req, res) => {
  const plannerId = parseInt(req.params.id);
  try {
    await prisma.dailyPlan.delete({
      where: { id: plannerId },
    });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: "Errore nell'eliminazione del planner" });
  }
});

// DELETE rimuovi voce dal planner
router.delete("/item/:id", authMiddleware, async (req, res) => {
  const itemId = parseInt(req.params.id);
  try {
    await prisma.dailyPlanItem.delete({
      where: { id: itemId },
    });
    res.json({ success: true });
  } catch (error) {
    console.error("Errore nella DELETE planner item:", error);
    res.status(500).json({ error: "Errore durante l'eliminazione" });
  }
});

// GET planner per data
router.get("/:date", authMiddleware, async (req, res) => {
  const userId = req.user.id;
  const dateParam = req.params.date;
  const dateObj = new Date(dateParam);

  const planner = await prisma.dailyPlan.findFirst({
    where: { userId, date: dateObj },
    include: {
      items: {
        include: {
          attraction: true,
          showSchedule: {
            include: { show: true },
          },
        },
      },
    },
  });

  if (!planner) {
    return res.status(404).json({ error: "Nessun planner per questa data" });
  }

  res.json(planner);
});

//aggiungi item al planner già esistente
router.post("/:plannerId/add", authMiddleware, async (req, res) => {
  const { plannerId } = req.params;
  const { items } = req.body;
  const userId = req.user.id;

  try {
    const planner = await prisma.dailyPlan.findFirst({
      where: { id: Number(plannerId), userId },
    });

    if (!planner) {
      return res.status(404).json({ error: "Planner non trovato" });
    }

    // Aggiungi nuovi item al planner
  const newItems = await Promise.all(
  items.map((item) =>
    prisma.dailyPlanItem.create({
      data: {
        planId: planner.id,
        attractionId: item.attractionId || null,
        showScheduleId: item.showScheduleId || null,
      },
      include: {
        attraction: true,
        showSchedule: {
          include: { show: true },
        },
      },
    })
  )
);


    res.json({ success: true, newItems });
  } catch (error) {
    console.error("Errore aggiunta item al planner:", error);
    res.status(500).json({ error: "Errore server" });
  }
});

export default router;
