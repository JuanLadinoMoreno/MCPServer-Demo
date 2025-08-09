import { MCPSalesServer } from './server.js';

async function main() {
  const server = new MCPSalesServer();
  await server.start();
}

main().catch((error) => {
  console.error('Error al iniciar el servidor:', error);
  process.exit(1);
});

// import { Server } from '@modelcontextprotocol/sdk/server/index.js';
// import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio';
// import { z } from 'zod';

// const server = new Server(
//   { name: 'mcp-sales-server', version: '1.0.0' },
//   { capabilities: { tools: {} } }
// );

// const transport = new StdioServerTransport();
// await server.connect(transport);