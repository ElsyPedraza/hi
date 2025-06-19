import express from "express"
import prisma from "../prisma/prismaClient.js"
import bcrypt from "bcrypt"
import jsonwebtoken from "jsonwebtoken"
import { authMiddleware } from "../middlewares/auth.middleware.js";
import validatorMiddleware from "../middlewares/validator.middleware.js"
import { loginValidator, registerValidator } from "../validators/auth.validator.js"
import multer from "multer";
import { updateProfileValidator, changePasswordValidator } from "../validators/profile.validator.js";


const authRouter = express.Router()
const upload = multer({ dest: "uploads/" }); 

authRouter.post("/register", validatorMiddleware(registerValidator), async (req, res) => {
  const { firstName, lastName, email, password, birthdate } = req.body

  console.log("Dati ricevuti per registrazione:", {
    firstName,
    lastName,
    email,
    birthdate,
    passwordLength: password?.length,
  })

  try {
    // Controlla se l'utente esiste già
    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      console.log("Email già registrata:", email)
      return res.status(400).json({
        message: "Email già registrata",
      })
    }

    // Hash password
    const hashedPassword = bcrypt.hashSync(password, 10)

    // Crea utente
    const user = await prisma.user.create({
      data: {
        firstName,
        lastName: lastName || "",
        email,
        password: hashedPassword,
        birthdate: new Date(birthdate),
      },
    })

    console.log("Utente creato con successo:", {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
    })

    const { password: _, ...userWithoutPassword } = user

    // Genera token per login automatico
    const token = jsonwebtoken.sign(userWithoutPassword, process.env.JWT_SECRET, { expiresIn: "1d" })

    res.status(201).json({
      message: "Utente registrato con successo",
      user: userWithoutPassword,
      token,
    })
  } catch (error) {
    console.error("Errore registrazione:", error)
    res.status(500).json({
      message: "Impossibile registrare l'utente",
      error: process.env.NODE_ENV === "development" ? error.message : "Errore generico",
    })
  }
})

authRouter.post("/login", validatorMiddleware(loginValidator), async (req, res) => {
  const { email, password } = req.body

  console.log("Tentativo di login per:", email)

  try {
    const user = await prisma.user.findUnique({
      where: { email },
    })

    if (!user) {
      console.log("Utente non trovato:", email)
      return res.status(401).json({
        message: "Credenziali non valide",
      })
    }

    const pswCheck = bcrypt.compareSync(password, user.password)
    if (!pswCheck) {
      console.log("Password non valida per:", email)
      return res.status(401).json({
        message: "Credenziali non valide",
      })
    }

    const { password: psw, ...userWithoutPsw } = user

    const token = jsonwebtoken.sign(userWithoutPsw, process.env.JWT_SECRET, { expiresIn: "1d" })

    console.log("Login effettuato con successo per:", email)

    res.json({
      message: "Login effettuato con successo",
      token,
      user: userWithoutPsw,
    })
  } catch (error) {
    console.error("Errore login:", error)
    res.status(500).json({
      message: "Impossibile autenticare l'utente",
      error: process.env.NODE_ENV === "development" ? error.message : "Errore generico",
    })
  }
})

authRouter.put(
  "/profile",
  authMiddleware,
  upload.single("avatar"),
  validatorMiddleware(updateProfileValidator),
  async (req, res) => {
    const userId = req.user.id;
    const { firstName, lastName, email, phone, birthdate, bio, location } = req.body;

    try {
      const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: {
          firstName,
          lastName,
          email,
          phone,
          location,
          bio,
          birthdate: birthdate ? new Date(birthdate) : undefined,
          avatar: req.file ? `/uploads/${req.file.filename}` : undefined,
        },
      });

      const { password, ...userWithoutPassword } = updatedUser;
      res.json({ message: "Profilo aggiornato con successo", user: userWithoutPassword });
    } catch (error) {
      console.error("Errore update profilo:", error);
      res.status(500).json({ message: "Errore durante l'aggiornamento del profilo" });
    }
  }
);

// Cambia password
authRouter.put(
  "/change-password",
  authMiddleware,
  validatorMiddleware(changePasswordValidator),
  async (req, res) => {
    const userId = req.user.id;
    const { currentPassword, newPassword } = req.body;

    try {
      const user = await prisma.user.findUnique({ where: { id: userId } });

      const valid = bcrypt.compareSync(currentPassword, user.password);
      if (!valid) {
        return res.status(400).json({ message: "Password attuale non corretta" });
      }

      const hashedNew = bcrypt.hashSync(newPassword, 10);
      await prisma.user.update({
        where: { id: userId },
        data: { password: hashedNew },
      });

      res.json({ message: "Password aggiornata con successo" });
    } catch (error) {
      console.error("Errore cambio password:", error);
      res.status(500).json({ message: "Errore cambio password" });
    }
  }
);





export default authRouter
