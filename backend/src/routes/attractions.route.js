import express from 'express'
import { PrismaClient } from '@prisma/client'

const router = express.Router()
const prisma = new PrismaClient()

//Crea una nuova attrazione
router.post('/create', async (req, res) => {
  const { name, category, description, locationX, locationY } = req.body
  try {
    const attraction = await prisma.attraction.create({
      data: {
        name,
        category,
        description,
        locationX: parseFloat(locationX),
        locationY: parseFloat(locationY),
      }
    })
    res.status(201).json(attraction)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

//Ottieni tutte le attrazioni
router.get('/', async (req, res) => {
  try {
    const attractions = await prisma.attraction.findMany({
      include: {
        waitTimes: {
          orderBy: { updatedAt: 'desc' },
          take: 1
        }
      }
    })

    // Convertiamo i dati per il frontend
    const mapped = attractions.map((a) => ({
      id: a.id,
      name: a.name,
      description: a.description,
      category: a.category,
      waitTime: a.waitTimes[0]?.waitMinutes || 0,
      minHeight: null,
      maxHeight: null,
      status: 'open',
      rating: 4.5, // dummy
      image: `http://localhost:3000${a.image}`,
      location: {
        x: a.locationX,
        y: a.locationY
      }
    }))

    res.json(mapped)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// 👉 Ottieni una attrazione per ID
router.get('/:id', async (req, res) => {
  const id = parseInt(req.params.id)
  try {
    const attraction = await prisma.attraction.findUnique({
      where: { id },
      include: { waitTimes: true }
    })
    if (!attraction) {
      return res.status(404).json({ error: 'Attrazione non trovata' })
    }
    res.json(attraction)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})



export default router