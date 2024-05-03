const swaggerJSDoc = require('swagger-jsdoc');

const swaggerDefinition = {
    openapi: '3.0.0',
    info: {
        title: 'BillBuddies API',
        version: '1.0.0',
        description: 'API backend for BillBuddies app',
    },
    servers: [
        {
          url: "http://localhost:8081/",
          description: "Local server"
        },
        {
          url: "https://gdsi-billbuddies-backend.onrender.com",
          description: "Live server"
        },
    ],
};

const options = {
    swaggerDefinition,
    apis: ['./routes/*.js'], // Path to the API routes in your Node.js application
};

const swaggerSpec = swaggerJSDoc(options);
module.exports = swaggerSpec;