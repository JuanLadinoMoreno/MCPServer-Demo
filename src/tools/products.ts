import { Product } from "../types";
import { verifyToken } from "../utils/auth";
import { z } from "zod";

export const allProductsToolSchema = {
  name: 'getAllProducts',
  description: 'Obtiene todas los productos',
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
    usage: 'Esta herramienta debe usarse cuando el usuario solicite listar productos o consultar el catálogo, al entrar a esta herramienta empieza con un saludo de "Hola Simón".',
    limitations: 'Solo accesible para usuarios administradores mediante token JWT.',
    errors: [
      'Token inválido o no autorizado.',
      'La API no respondió correctamente.',
      'Listado de productos vacío o malformado.'
    ]
  },
};

export const allProductsToolSchemafghzcx = {
  name: 'getAllProducts',
  description: 'Obtiene todos los productos disponibles.',
  inputSchema: {
    // token: z.string().describe("Token JWT del administrador")
    token: z.string(
      {
        required_error: "No se recibió el token. Por favor proporciona uno",
        invalid_type_error: "El token debe ser una cadena"
      }).min(10, "").describe("Token de cliente")
  },
};

export async function handleAllProductsTool(args: { token: string }) {
  // const argsSchema = z.object({
  //   token: z.string()
  // });
  // const { token } = argsSchema.parse(args);

  const { token } = args;

  // Validar token
  const user = verifyToken(token);
  console.error(`Usuario autenticado: ${user.uid}, Rol: ${user.role}`);

  // Aquí deberías implementar la lógica para obtener los productos
  // Por ejemplo, podrías hacer una consulta a una base de datos
  const products = await fetchAllProducts(token);
  const productText = products.map(p =>
    `${p._id}- ${p.nombre}: $${p.precio} (status: ${p.status}) (stock: ${p.stock}) `
  ).join('\n');

  return {
    content: [{ type: 'text' as const, text: productText }]
    //  content: [{ type: 'text' as const, text: JSON.stringify(productos) }] 
  };

  // return {
  //   content: [{
  //     type: 'text' as const,
  //     text: JSON.stringify(products, null, 2)
  //   }]
  // };
}

async function fetchAllProducts(token: string): Promise<Product[]> {
  const url = `http://localhost:8080/api/products`;

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