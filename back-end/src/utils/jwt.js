import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const SECRET = process.env.SECRET;

export const gerarToken = (payload) => jwt.sign(payload, SECRET, { expiresIn: "8h" });
export const verificarToken = (token) => jwt.verify(token, SECRET);