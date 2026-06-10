import bcrypt from "bcryptjs";
import Usuario from "../models/usuario.model.js";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
    try {
        const { nombre, email, password, rol } = req.body;

        const existeUsuario = await Usuario.findOne({
            where: { email }
        });

        if (existeUsuario) {
            return res.status(400).json({
                mensaje: "El email ya está registrado"
            });
        }

        const passwordHash = await bcrypt.hash(password, 10);

        const usuario = await Usuario.create({
            nombre,
            email,
            passwordHash,
            rol
        });

        res.status(201).json({
            mensaje: "Usuario creado correctamente",
            usuario
        });

    } catch (error) {
        res.status(500).json({
            mensaje: error.message
        });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const usuario = await Usuario.findOne({
            where: { email }
        });

        if (!usuario) {
            return res.status(401).json({
                mensaje: "Credenciales inválidas"
            });
        }

        const coincide = await bcrypt.compare(
            password,
            usuario.passwordHash
        );

        if (!coincide) {
            return res.status(401).json({
                mensaje: "Credenciales inválidas"
            });
        }

        const token = jwt.sign(
            {
                id: usuario.id,
                email: usuario.email,
                rol: usuario.rol
            },
            "mi-secreto",
            {
                expiresIn: "1h"
            }
        );

        res.json({
            mensaje: "Login exitoso",
            token
        });

    } catch (error) {
        res.status(500).json({
            mensaje: error.message
        });
    }
};