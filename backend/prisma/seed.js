import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");
  const hashedPassword = await bcrypt.hash("Password1!", 10);

  //Pulisce l'utente demo se già esiste
  await prisma.user.deleteMany({
    where: { email: "elsy2@example.com" },
  });

  //Crea tipi di biglietto
  await prisma.ticketType.createMany({
    data: [
      {
        name: "Biglietto Giornaliero",
        price: 25.0,
        durationDays: 1,
        description: "Valido per 1 giorno, accesso completo al parco",
        features: [
          "Tutte le attrazioni",
          "Spettacoli inclusi",
          "Mappa digitale",
          "WiFi gratuito",
        ],
      },
      {
        name: "Biglietto Famiglia",
        price: 60.0,
        durationDays: 1,
        description: "Ingresso valido per 2 adulti + 2 bambini, per 1 giorno",
        features: [
          "Tutte le attrazioni",
          "Spettacoli inclusi",
          "Mappa digitale",
          "WiFi gratuito",
        ],
      },
      {
        name: "Abbonamento Settimanale",
        price: 90.0,
        durationDays: 7,
        description: "Accesso illimitato al parco per 7 giorni consecutivi",
        features: [
          "Tutte le attrazioni",
          "Spettacoli inclusi",
          "Mappa digitale",
          "WiFi gratuito",
        ],
      },
    ],
  });

  //Recupera tipo biglietto giornaliero
  const tipoBiglietto = await prisma.ticketType.findFirst({
    where: { name: "Biglietto Giornaliero" },
  });

  if (!tipoBiglietto) {
    throw new Error(
      "Biglietto Giornaliero non trovato! Controlla che sia stato creato prima."
    );
  }

  // Crea utente demo
  const utenteDemo = await prisma.user.create({
    data: {
      email: "elsy2@example.com",
      password: hashedPassword, // hash in produzione
      firstName: "Elsy",
      lastName: "Demo",
      birthdate: new Date("1990-01-01"),
    },
  });

  //Crea biglietto per l’utente
  await prisma.ticket.create({
    data: {
      userId: utenteDemo.id,
      typeId: tipoBiglietto.id,
      validDate: new Date(), // oggi
      qrCode: `QR-${Date.now()}-${utenteDemo.id}`,
    },
  });

  //Attrazioni
  const mantagnaRusa = await prisma.attraction.create({
    data: {
      name: "Montagne Russe",
      category: "giostra",
      description: "Emozione pura tra curve e discese mozzafiato ad alta velocità.",
      image: "/pix/attractions/montagna_rusa.png",
    },
  });

  const navePirata = await prisma.attraction.create({
    data: {
      name: "Nave Pirata",
      category: "giostra",
      description: "Un’imbarcazione che oscilla tra cielo e terra come un vero galeone.",
      image: "/pix/attractions/nave_pirata.png",
    },
  });

  const ruotaPanoramica = await prisma.attraction.create({
    data: {
      name: "Ruota Panoramica",
      category: "giostra",
      description: "Cabine sospese che ti portano in alto per una vista mozzafiato sul parco",
      image: "/pix/attractions/ruota_panoramica.png",
    },
  });

  const carosello = await prisma.attraction.create({
    data: {
      name: "Carosello",
      category: "bambini",
      description: "Cavalli e carrozze colorate per un classico giro di divertimento.",
      image: "/pix/attractions/carosello.png",
    },
  });

  const trenino = await prisma.attraction.create({
    data: {
      name: "Trenino del Parco",
      category: "tour",
      description: "Un tour rilassante attorno al laghetto tra natura e sorrisi.",
      image: "/pix/attractions/trenino.png",
    },
  });

  const autoscontro = await prisma.attraction.create({
    data: {
      name: "Autoscontro",
      category: "giostra",
      description: "Sfreccia, evita o colpisci: il caos più divertente del parco!",
      image: "/pix/attractions/autoscontro.png",
    },
  });

  const tendaGrande = await prisma.attraction.create({
    data: {
      name: "Tenda Grande",
      category: "spettacolo",
      description: "Il cuore degli spettacoli più attesi e delle grandi emozioni.",
      image: "/pix/attractions/tenda_grande.png",
    },
  });

  const tendaPiccola = await prisma.attraction.create({
    data: {
      name: "Tenda Piccola",
      category: "spettacolo",
      description: "Spettacoli vivaci e divertenti pensati per tutta la famiglia.",
      image: "/pix/attractions/tenda_piccola.png",
    },
  });

  const teatro = await prisma.attraction.create({
    data: {
      name: "Teatro del Parco",
      category: "spettacolo",
      description: "Musical e risate in uno spazio magico e coinvolgente.",
      image: "/pix/attractions/teatro.png",
    },
  });

  const castello = await prisma.attraction.create({
    data: {
      name: "Castello delle Avventure",
      category: "bambini",
      description: "Un regno fantastico per piccoli esploratori coraggiosi.",
      image: "/pix/attractions/castello.png",
    },
  });

  //Spettacoli
  const spettacolo1 = await prisma.show.create({
    data: {
      title: "Magia del Fuoco",
      description: "Magia e fuochi pirotecnici che incantano grandi e piccini con il Mago Lumos",
      image: "/pix/shows/magia_fuoco.png",
      attractionId: tendaGrande.id,
    },
  });

  const spettacolo2 = await prisma.show.create({
    data: {
      title: "Musical Fantasy",
      description:
        "Personaggi dei cartoni animati cantano e ballano in un grande musical",
      image: "/pix/shows/musical_fantasy.png",
      attractionId: tendaPiccola.id,
    },
  });

  const spettacolo3 = await prisma.show.create({
    data: {
      title: "Spettacolo di Bolle",
      description: "Bolle giganti e interazione con il pubblico più giovane",
      image: "/pix/shows/bolle.png",
      attractionId: teatro.id,
    },
  });

  const spettacolo4 = await prisma.show.create({
    data: {
      title: "Storie sotto le Stelle",
      description:
        "Narrazioni animate con effetti speciali sotto il cielo notturno con effetti speciali.",
      image: "/pix/shows/stelle.png",
      attractionId: teatro.id,
    },
  });

  const spettacolo5 = await prisma.show.create({
    data: {
      title: "Magico Illusionista",
      description:
        "Grandi trucchi e illusioni da palco con il misterioso El Mago",
      image: "/pix/shows/illusionista.png",
      attractionId: tendaGrande.id,
    },
  });

  const spettacolo6 = await prisma.show.create({
    data: {
      title: "Talenti in Scena",
      description: "Concerto con giovani band emergenti del territorio",
      image: "/pix/shows/talenti.png",
      attractionId: teatro.id,
    },
  });

  function generateDatesForShow(
    showId,
    fromDateStr,
    toDateStr,
    onlyWeekends = false,
    slot = "Pomeriggio"
  ) {
    const result = [];
    const from = new Date(fromDateStr);
    const to = new Date(toDateStr);

    let time;
    if (slot === "Mattina") time = "10:00:00";
    else if (slot === "Sera") time = "20:00:00";
    else time = "17:00:00"; // Default: Pomeriggio

    for (let d = new Date(from); d <= to; d.setDate(d.getDate() + 1)) {
      const day = d.getDay();
      const isSummer = [5, 6, 7].includes(d.getMonth());
      if (!onlyWeekends || [0, 5, 6].includes(day) || isSummer) {
        const date = new Date(d);
        const start = new Date(`${date.toISOString().split("T")[0]}T${time}Z`);
        const end = new Date(start.getTime() + 60 * 60 * 1000); // 1h

        result.push({
          showId,
          date,
          startTime: start,
          endTime: end,
        });
      }
    }

    return result;
  }

  const dates1 = generateDatesForShow(
    spettacolo1.id,
    "2025-06-20",
    "2025-08-31",
    false,
    "Mattina"
  );
  const dates2 = generateDatesForShow(
    spettacolo2.id,
    "2025-06-20",
    "2025-08-31",
    false,
    "Mattina"
  );

  const dates3 = generateDatesForShow(
    spettacolo3.id,
    "2025-07-01",
    "2025-07-31",
    false,
    "Pomeriggio"
  );
  const dates4 = generateDatesForShow(
    spettacolo4.id,
    "2025-06-20",
    "2025-08-31",
    false,
    "Pomeriggio"
  );

  const dates5 = generateDatesForShow(
    spettacolo5.id,
    "2025-06-20",
    "2025-08-31",
    false,
    "Sera"
  );
  const dates6 = generateDatesForShow(
    spettacolo6.id,
    "2025-07-01",
    "2025-07-31",
    false,
    "Sera"
  );

  //Orari spettacoli
  await prisma.showSchedule.createMany({
    data: [...dates1, ...dates2, ...dates3, ...dates4, ...dates5, ...dates6],
  });

  await prisma.waitTime.createMany({
  data: [
    { attractionId: mantagnaRusa.id, waitMinutes: 30 },
    { attractionId: navePirata.id, waitMinutes: 15 },
    { attractionId: ruotaPanoramica.id, waitMinutes: 10 },
    { attractionId: carosello.id, waitMinutes: 5 },
    { attractionId: trenino.id, waitMinutes: 8 },
    { attractionId: autoscontro.id, waitMinutes: 20 },
    { attractionId: castello.id, waitMinutes: 10 },
  ],
});


  //Orari parco
  await prisma.parkHours.createMany({
    data: [
      { dayOfWeek: 0, openTime: "10:00", closeTime: "20:00" },
      { dayOfWeek: 1, openTime: "10:00", closeTime: "20:00" },
      { dayOfWeek: 2, openTime: "10:00", closeTime: "20:00" },
      { dayOfWeek: 3, openTime: "10:00", closeTime: "20:00" },
      { dayOfWeek: 4, openTime: "10:00", closeTime: "22:00" },
      { dayOfWeek: 5, openTime: "09:00", closeTime: "23:00" },
      { dayOfWeek: 6, openTime: "09:00", closeTime: "23:00" },
    ],
  });

  console.log("✔️  Seeding completato con successo!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => {
    prisma.$disconnect();
  });
