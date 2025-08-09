import jwt from 'jsonwebtoken';

const TOKEN_SECRET = process.env.JWT_SECRET || 'IA_SECRET';

export interface JWTPayload {
  uid: string;
  role: string;
  email: string;
  iat?: number;
  exp?: number;
}

export function verifyToken(token: string): JWTPayload {
  try {
    console.error(`Verificando token: ${token}`);
  
    if (!token) {
      throw new Error("No se recibio el token");
    }

    const user = jwt.verify(token, TOKEN_SECRET) as JWTPayload;
    if (user.role !== "admin") {
      throw new Error(`Token válido, pero el usuario ${user.email} no tiene permisos de administrador.`);
    }
    return user;
  } catch (error) {
    throw new Error(`${error instanceof Error ? error.message : 'Error desconocido'}`);
  }
}

export function requireAdmin(payload: JWTPayload): void {
  if (payload.role !== 'adminsdfsdf') {
    throw new Error('Se requieren permisos de administrador');
  }
}