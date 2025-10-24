import express from "express";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import swaggerJsdoc from 'swagger-jsdoc';

const app = express();
const port = 3150;

app.use(cors());
app.use(express.json());

// Configuração do Swagger
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API de Poll',
      version: '1.0.0',
      description: 'API para gerenciamento de enquetes',
    },
  },
  apis: ['./src/routes/*.ts'], // ⚠️ aqui aponta para a pasta routes
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

// swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

import pollRoutes from './routes/poll.routes';
app.use('/api/poll', pollRoutes);

app.listen(port, () => {
  console.log(`🚀 Servidor iniciado em http://localhost:${port}`);
});
