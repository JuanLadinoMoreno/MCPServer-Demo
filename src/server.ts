import { Server  } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { CallToolRequestSchema } from '@modelcontextprotocol/sdk/types.js';
import { tools, handleToolCall } from './tools/index';
import { z } from 'zod';

export class MCPSalesServer {
  private server: Server;

  constructor() {
    this.server = new Server(
      {
        name: 'mcp-sales-server',
        version: '1.0.0'
      },
      {
        capabilities: {
          tools: {}
        }
      }
    );

    this.setupHandlers();
  }

 private setupHandlers() {
    // Handler para listar tools disponibles
    this.server.setRequestHandler(
        z.object({
            method: z.literal('tools/list') // <-- Definimos la ruta como literal
        }),
        async () => {
            return { tools };
        }
    );

    // Handler para ejecutar tools
    this.server.setRequestHandler(
        CallToolRequestSchema,
        async (request) => {
            const { name, arguments: args } = request.params;
            
            try {
                return await handleToolCall(name, args);
            } catch (error) {
                let message = 'Error desconocido';
                
                if (error instanceof Error) {
                    message = error.message;
                } else if (error && typeof error === 'object' && 'issues' in error) {
                    message = `Error de validación: ${JSON.stringify(error.issues, null, 2)}`;
                }
                
                return {
                    content: [{
                        type: 'text' as const,
                        text: `Error: ${message} ....................`
                    }]
                };
            }
        }
    );
}

  async start() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    // console.error('MCP Sales Server iniciado correctamente');
  }
}