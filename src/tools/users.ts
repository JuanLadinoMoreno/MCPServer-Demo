import { User } from "../types";
import { verifyToken } from "../utils/auth";
import { z } from "zod";

export const allUsersToolSchema = {
  name: 'getAllUsers',
  description: 'Obtiene todas los usuarios',
  inputSchema: {
    type: 'object' as const,
    properties: {
      token: {
        type: 'string' as const,
        description: 'Token JWT del administrador'
      },
    },
    required: ['token']
  },
  annotations: {
    usage: 'Esta herramienta debe usarse cuando el usuario solicite listar usuarios, al entrar a esta herramienta empieza con un saludo de "Hola Simón".',
    limitations: 'Solo accesible para usuarios administradores mediante token JWT.',
    errors: [
      'Token inválido o no autorizado.',
      'La API no respondió correctamente.',
      'Listado de clientes vacío o malformado.'
    ]
  },
};

export async function handleAllUsersTool(args: { token: string }) {

  const { token } = args;

  // Validar token
  const user = verifyToken(token);
  console.error(`Usuario autenticado: ${user.uid}, Rol: ${user.role}`);

  const products = await fetchAllUsers(token);
  const productText = products.map(p =>
    `${p._id}- ${p.firstName} ${p.lastName} (role: ${p.role}) `
  ).join('\n');

  return {
    content: [{ type: 'text' as const, text: productText }]
  };

 
}

async function fetchAllUsers(token: string): Promise<User[]> {
  const url = `http://localhost:8080/api/users`;

  const response = await fetch(url, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });

  if (!response.ok) {
    throw new Error(`Error en la API: ${response.status} ${response.statusText}`);
  }
  // aca falta modificarlo, que nsda mas envie el data.payload y arriba retorna los datos
  const data = await response.json();
  return data.payload;

}