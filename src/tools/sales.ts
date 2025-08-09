import { z } from 'zod';
import { verifyToken } from '../utils/auth.js';
import type { Sale, ApiResponse, TopSeller, SalesRequest } from '../types/index.js';

export const salesToolSchema = {
  name: 'getTopSellerByBranch',
  description: 'Obtiene el usuario que más vendió en una sucursal en un período específico',
  inputSchema: {
    type: 'object' as const,
    properties: {
      token: {
        type: 'string' as const,
        description: 'Token JWT del administrador'
      },
      branchId: {
        type: 'string' as const,
        description: 'ID de la sucursal'
      },
      month: {
        type: 'number' as const,
        minimum: 1,
        maximum: 12,
        description: 'Mes a consultar (1-12)'
      },
      year: {
        type: 'number' as const,
        minimum: 2020,
        maximum: 2030,
        description: 'Año a consultar'
      }
    },
    required: ['token', 'branchId', 'month', 'year']
  }
};

export async function handleTopSellerTool(args: SalesRequest) {
  const { token, branchId, month, year } = args;

  // Validar token
  const user = verifyToken(token);
  console.error(`Usuario autenticado: ${user.uid}, Rol: ${user.role}`);
  
  
  // Obtener datos de ventas
  const sales = await fetchSalesData(token, branchId, month, year);
  
  // Procesar y encontrar el top seller
  const topSeller = calculateTopSeller(sales);
  
  return {
    content: [{
      type: 'text' as const,
      text: JSON.stringify({
        topSeller,
        periodo: `${month.toString().padStart(2, '0')}/${year}`,
        sucursal: branchId,
        totalVentas: sales.length,
        resumen: `${topSeller ? `El top seller es ${topSeller.nombre} con $${topSeller.totalVentas}` : 'No hubo ventas en este período'}`
      }, null, 2)
    }]
  };
}

async function fetchSalesData(token: string, branchId: string, month: number, year: number): Promise<Sale[]> {
  const url = `http://localhost:8080/api/carts/month-branch?branch=${branchId}&month=${month}&anio=${year}`;
  
  const response = await fetch(url, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });

  if (!response.ok) {
    throw new Error(`Error en la API: ${response.status} ${response.statusText}`);
  }

  const data: ApiResponse<Sale[]> = await response.json();
  
  if (!data.success || !Array.isArray(data.payload)) {
    throw new Error('Formato de respuesta inválido');
  }

  return data.payload;
}

function calculateTopSeller(sales: Sale[]): TopSeller | null {
  if (sales.length === 0) {
    return null;
  }

  const salesByUser = new Map<string, { nombre: string; total: number }>();

  for (const sale of sales) {
    const userId = sale.user._id;
    const userName = `${sale.user.firstName} ${sale.user.lastName || ''}`.trim();
    const saleAmount = sale.totalPrice || 0;

    const existing = salesByUser.get(userId);
    if (existing) {
      existing.total += saleAmount;
    } else {
      salesByUser.set(userId, {
        nombre: userName,
        total: saleAmount
      });
    }
  }

  let topSeller: TopSeller | null = null;
  let maxSales = 0;

  for (const [id, { nombre, total }] of salesByUser.entries()) {
    if (total > maxSales) {
      maxSales = total;
      topSeller = { id, nombre, totalVentas: total };
    }
  }

  return topSeller;
}