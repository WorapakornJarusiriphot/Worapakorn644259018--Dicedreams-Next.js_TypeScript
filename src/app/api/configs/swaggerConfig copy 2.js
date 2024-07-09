const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Dicedreams API',
      version: '1.0.0',
      description: 'API Documentation for Dicedreams Application',
      contact: {
        name: "Worapakorn Jarusiriphot",
        url: "https://www.youtube.com/channel/UChBSP5RDoVu7jcA1lBK6aww",
        email: "644259018@webmail.npru.ac.th",
      },
    },
    externalDocs: {
      description: "Download Swagger.json",
      url: "/swagger.json",
    },
    servers: [
      {
        url: 'https://dicedreams-backend-deploy-to-render.onrender.com/api',
        description: "Development server",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ['./src/app/api/routers/*.js'], // ที่อยู่ของไฟล์ที่มีคอมเมนต์ Swagger
};

const specs = swaggerJsdoc(options);

module.exports = { swaggerUi, specs };
