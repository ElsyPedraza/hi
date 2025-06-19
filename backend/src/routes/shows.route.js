import express from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

// GET /api/shows?date=all oppure ?date=2025-06-20
router.get("/", async (req, res) => {
  try {
    const { date } = req.query;

    let schedules;
    if (date && date !== "all") {
      // solo spettacoli per una data specifica
      schedules = await prisma.showSchedule.findMany({
        where: { date: new Date(date) },
        include: {
          show: {
            include: { attraction: true }
          }
        },
        orderBy: { startTime: "asc" }
      });
    } else {
      // tutti gli spettacoli, tutte le date
      schedules = await prisma.showSchedule.findMany({
        include: {
          show: {
            include: { attraction: true }
          }
        },
        orderBy: { date: "asc" }
      });
    }

    // Mappiamo ogni schedule in una "card" di spettacolo
    const mapped = schedules.map((s) => ({
      id: s.show.id,
      name: s.show.title,
      description: s.show.description,
      image: `http://localhost:3000${s.show.image}`,
      location: s.show.attraction?.name || "Palco principale",
      date: s.date.toISOString().split("T")[0],
      time: new Date(s.startTime).toLocaleTimeString("it-IT", { hour: "2-digit", minute: "2-digit" }),
      duration: (new Date(s.endTime) - new Date(s.startTime)) / 60000,
      availableSeats: Math.floor(Math.random() * 80 + 20),
      capacity: 100,
      category: "default",
      rating: (4 + Math.random()).toFixed(1),
      ageRecommendation: "Tutti",
      scheduleId: s.id,
    }));

    res.json(mapped);
  } catch (error) {
    console.error("Errore nel recupero spettacoli:", error);
    res.status(500).json({ error: "Errore nel recupero spettacoli" });
  }
});

router.get("/show-schedule", async (req, res) => {
  const { date } = req.query;

  const schedules = await prisma.showSchedule.findMany({
    where: {
      date: new Date(date),
    },
    include: {
      show: true,
    },
  });

  res.json(schedules);
});


export default router;
