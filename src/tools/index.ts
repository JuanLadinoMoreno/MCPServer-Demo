import { salesToolSchema, handleTopSellerTool } from './sales.js';
import { allProductsToolSchema, handleAllProductsTool } from './products.js';
import { allClientsToolSchema, handleAllClientsTool } from './clients.js';
import { allUsersToolSchema, handleAllUsersTool } from './users.js';
import { allBranchesToolSchema, handleAllBranchesTool } from './branches.js';


export const tools = [
  salesToolSchema,
  allProductsToolSchema,
  allClientsToolSchema,
  allUsersToolSchema,
  allBranchesToolSchema
];

export async function handleToolCall(name: string, args: any) {
  switch (name) {
    case 'getTopSellerByBranch':
      return await handleTopSellerTool(args);
    case 'getAllProducts':
      return await handleAllProductsTool(args);
    case 'getAllUsers':
      return await handleAllUsersTool(args);
    case 'getAllClients':
      return await handleAllClientsTool(args);
    case 'getAllBranches':
      return await handleAllBranchesTool(args);
    default:
      throw new Error(`Tool "${name}" no encontrado`);
  }
}