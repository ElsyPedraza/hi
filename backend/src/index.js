import express from "express";
import cors from "cors";
/* const jwt = require('jsonwebtoken'); */
import authRouter from "./routes/auth.route.js";
import attractionsRouter from './routes/attractions.route.js';
import showsRouter from "./routes/shows.route.js"
import plannerRouter from "./routes/planner.route.js";
import ticketsRouter from "./routes/tickets.route.js";
import path from "path";
import { fileURLToPath } from "url";
import adminRouter from "./routes/admin.route.js";

import dotenv from "dotenv";
dotenv.config(); // Carica le variabili d'ambiente da un file .env

const PORT = process.env.PORT || 3000;

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.json());


app.use(cors({
  origin: ["https://hi-front.onrender.com", "http://localhost:5173"], 
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  credentials: true  // Metodi consentiti tutti
}))
// Middleware per il parsing del JSON


//Routes
app.use('/api/auth', authRouter);
app.use('/api/attractions', attractionsRouter);
app.use("/api/shows", showsRouter)
app.use("/api/planner", plannerRouter);
app.use("/api/tickets", ticketsRouter);
app.use('/api/show-schedule', showsRouter);
app.use("/api/admin", adminRouter);
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

app.use(express.static('public'))





// Route di test
app.get("/", (req, res) => {
  res.json({ blogPosts: ["Post 1", "Post 2", "Post 3"]});
});

app.get("/debug-env", (req, res) => {
  res.send("DATABASE_URL: " + process.env.DATABASE_URL);
});
// Avvio del server
app.listen(PORT, () => {
  console.log(`Server in esecuzione sulla porta ${PORT}`);
});