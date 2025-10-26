import express from "express";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import swaggerJsdoc from 'swagger-jsdoc';

const app = express();
require('dotenv').config()
export const api_port = process.env.PORT || 3000;

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
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

import defaultRoutes from './routes/default.routes';
app.use('/', defaultRoutes)
app.use('/api', defaultRoutes)

import pollRoutes from './routes/poll.routes';
app.use('/api/poll', pollRoutes);

// Middleware 404 - SEMPRE NO FINAL, depois de todas as rotas
app.use((req, res, next) => {
  res.status(404).json({
    error: 'Route not found',
    message: `Cannot ${req.method} ${req.path}`,
    path: req.path
  });
});

// Middleware de erro (opcional, mas recomendado)
app.use((err: any, res) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    error: 'Internal server error',
    message: err.message
  });
});

app.listen(api_port, () => {
  console.log(`🚀 Servidor iniciado em http://localhost:${api_port}`);
});
