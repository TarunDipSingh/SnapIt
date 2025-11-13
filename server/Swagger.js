// server/swagger.js
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "SnapIt API Documentation",
      version: "1.0.0",
      description: "API documentation for SnapIt ecommerce backend",
      contact: {
        name: "TarunDip Singh",
        email: "support@snapit.com",
      },
    },

    servers: [
      {
        url: "http://localhost:4000",
        description: "Development server",
      },
    ],

    // 🔥 VERY IMPORTANT → THIS PART WAS MISSING
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },

    // OPTIONAL: make all routes protected by default
    // security: [{ bearerAuth: [] }],
  },

  apis: ["./routes/*.js"],
};

const swaggerSpec = swaggerJSDoc(options);

export { swaggerUi, swaggerSpec };
