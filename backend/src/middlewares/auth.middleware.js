import jsonwebtoken from 'jsonwebtoken';
import prisma from '../prisma/prismaClient.js';

export async function authMiddleware(req, res, next) {
    let token = req.header('Authorization') || '';
    token = token.replace('Bearer ', '');

    try {
        const userFromToken = jsonwebtoken.verify(
            token,
            process.env.JWT_SECRET
        )

        const user = await prisma.user.findUnique({
            where: { id: userFromToken.id }
        });

        if (!user) {
            throw new Error("user not found on db");
        }

        req.user = user;

    } catch (error) {
        return res.status(401).json({ message: 'Non autenticato!' });
    }

    next();
}