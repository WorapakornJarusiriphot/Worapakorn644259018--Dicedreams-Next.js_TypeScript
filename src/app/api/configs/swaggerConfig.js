// src/configs/swaggerConfig.js
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Dicedreams API',
      version: '1.0.0',
      description: 'API Documentation for Dicedreams Application',
    },
    servers: [
      {
        url: 'http://localhost:8080/api',
      },
    ],
  },
  apis: ['./src/app/api/routers/*.js'], // ที่อยู่ของไฟล์ที่มีคอมเมนต์ Swagger
};

const specs = swaggerJsdoc(options);

module.exports = { swaggerUi, specs };
