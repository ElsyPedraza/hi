import express from "express";
import { seed } from "../../prisma/seed.js"; // Assicurati che il percorso sia corretto

const router = express.Router();


router.post("/seed", async (req, res) => {
  try {
    await seed();
    res.json({ message: "Seed completato!" });
  } catch (error) {
    console.error("Errore durante il seed:", error);
    res.status(500).json({ error: "Errore durante il seed" });
  }
});

export default router;
