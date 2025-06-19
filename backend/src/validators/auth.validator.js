import { z } from "zod";
import prisma from "../prisma/prismaClient.js";

export const registerValidator = z.object({
    body: z.object({
        firstName: z.string().min(1, "Il nome è obbligatorio"),
        lastName: z.string().min(1, "Il cognome è obbligatorio"),
        email: z.string().email("Email non valida"),
        password: z.string()
            .min(8)
            .regex(/(?=.*\d)/, { message: 'Inserisci almeno un numero' })
            .regex(/(?=.*[a-z])/, { message: 'Inserisci almeno una minuscola' })
            .regex(/(?=.*[A-Z])/, { message: 'Inserisci almeno una maiuscola' })
            .regex(/[!?@#*%$\\|]/, { message: 'Inserisci almeno un carattere speciale' }),
        passwordConfirmation: z.string(),
        birthdate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Data di nascita non valida"), 
    })
}).superRefine(async (data, ctx) => {

    try {
        const user = await prisma.user.findUnique({
            where: { email: data.body.email }
        });

        if (user) {
            ctx.addIssue({
                code: 'custom',
                path: ['body', 'email'],
                message: 'Email già registrata!'
            })
        }
    } catch (error) {
        console.log(error);
    }

    if (data.body.password !== data.body.passwordConfirmation) {
        ctx.addIssue({
            code: 'custom',
            path: ['body', 'passwordConfirmation'],
            message: 'Le password devono essere uguali'
        })
    }
});

export const loginValidator = z.object({
    body: z.object({
        email: z.string().email(),
        password: z.string().min(1),
    })
})