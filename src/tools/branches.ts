import { Branch } from "../types";
import { verifyToken } from "../utils/auth";

export const allBranchesToolSchema = {
  name: 'getAllBranches',
  description: 'Obtiene todas las sucursales',
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
    usage: 'Esta herramienta debe usarse cuando el usuario solicite listar las sucursales".',
    limitations: 'Solo accesible para usuarios administradores mediante token JWT.',
    errors: [
      'Token inválido o no autorizado.',
      'La API no respondió correctamente.',
      'Listado de sucursales vacío o malformado.'
    ]
  },
};

export async function handleAllBranchesTool(args: { token: string }) {

  const { token } = args;

  // Validar token
  const user = verifyToken(token);
  console.error(`Usuario autenticado: ${user.uid}, Rol: ${user.role}`);

  const products = await fetchAllBranches(token);
  const productText = products.map(p =>
    `${p._id}- ${p.name} (phone: ${p.phone}) `
  ).join('\n');

  return {
    content: [{ type: 'text' as const, text: productText }]
  };

 
}

async function fetchAllBranches(token: string): Promise<Branch[]> {
  const url = `http://localhost:8080/api/branches`;

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