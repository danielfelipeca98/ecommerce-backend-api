import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import User from '../models/user.model.js';

const router = express.Router();

router.post('/register', async (req, res) => {
    try {
        const email = req.body.email
        const password = req.body.password
        const role = req.body.role || 'user'
        if (!password || !email) {
            res.status(400).json({ error: "Email y password obligaroios" })
            return;
        }
        const result = await User.findOne({ email })
        if (result) {
            res.status(409).json({ error: "Email ya esta registrado" })
            return;

        } else {
            const newUser = new User({ email, password, role });
            await newUser.save();
            const userResponse = newUser.toObject();
            delete userResponse.password;
            res.status(201).json({
                message: 'Usuario creado exitosamente',
                user: userResponse
            });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: `Error al cargar el usuario ${error.message}` });


    }
})

router.post('/login', async (req, res) => {
    try {
        const email = req.body.email
        const password = req.body.password
        if (!password || !email) {
            res.status(400).json({ error: "Email y password obligaroios" })
            return;
        }
        const result = await User.findOne({ email })
        if (!result) {
            res.status(401).json({ error: "Email o contraseña incorrectos" })
            return;
        } else {
            const esValida = await result.compararPassword(password);
            if (!esValida) {
                res.status(401).json({ error: "Contraseña erronea" })
                return;
            } else {
                const tkn = jwt.sign(
                    { id: result._id, email: result.email, role: result.role },
                    process.env.JWT_SECRET,
                    { expiresIn: '1h' }
                );
                    res.cookie('token', tkn, {
                        httpOnly: true,      
                        secure: false,       
                        maxAge: 3600000,     
                        sameSite: 'lax',
                        path: '/'
                    }
                    );
                    console.log('Cookie establecida con token:', tkn)
                res.status(200).json({ tkn, user: { id: result._id, email: result.email, role: result.role } });
                return;

            }

        }
    }

    catch (error) {
        console.error(error);
        res.status(500).json({ error: `Error al realizar login ${error.message}` });

    }
})



export default router;