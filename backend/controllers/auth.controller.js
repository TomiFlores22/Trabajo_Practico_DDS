import bcrypt from "bcryptjs";
import Usuario from "../models/usuario.model.js";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
    try {
        const { nombre, correo, password, rol } = req.body;

        const existeUsuario = await Usuario.findOne({
            where: { correo }
        });

        if (existeUsuario) {
            return res.status(400).json({
                mensaje: "El correo ya está registrado"
            });
        }

        const hash = await bcrypt.hash(password, 10);

        const usuario = await Usuario.create({
            nombre,
            correo,
            passwordHash: hash,
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
        const { correo, password } = req.body;

        const usuario = await Usuario.findOne({
            where: { correo }
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
                correo: usuario.correo,
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