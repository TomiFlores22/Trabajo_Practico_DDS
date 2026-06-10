import jwt from "jsonwebtoken";

export const verificarToken = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({
            mensaje: "Token requerido"
        });
    }

    const token = authHeader.replace("Bearer ", "");

    try {
        const payload = jwt.verify(
            token,
            "mi-secreto"
        );

        req.usuario = payload;

        next();

    } catch {
        return res.status(401).json({
            mensaje: "Token inválido"
        });
    }
};