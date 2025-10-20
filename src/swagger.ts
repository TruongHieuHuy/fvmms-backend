import swaggerJsdoc from 'swagger-jsdoc';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'FVMMS API Documentation',
      version: '1.0.0',
      description: 'API documentation for the Fishing Vessel Monitoring Management System.',
    },
    servers: [
      {
        url: 'http://localhost:3000', // URL server
        description: 'Development server',
      },
    ],
  },
  // Đường dẫn đến các file chứa chú thích OpenAPI
  apis: ['./src/features/**/*.route.ts'],
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;
