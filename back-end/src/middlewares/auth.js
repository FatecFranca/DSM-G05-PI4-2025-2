import { verificarToken } from "../utils/jwt.js";

export const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: "Token não fornecido" });

  const token = authHeader.split(" ")[1];
  try {
    const decoded = verificarToken(token);
    req.usuario = decoded;
    next();
  } catch {
    res.status(401).json({ error: "Token inválido" });
  }
};

export const authorize = (roles = []) => {
  return (req, res, next) => {
    const allowedRoles = Array.isArray(roles) ? roles : [roles];

    if (!allowedRoles.includes(req.usuario?.tipo)) {
      return res.status(403).json({ error: "Acesso negado" });
    }

    next();
  };
};
