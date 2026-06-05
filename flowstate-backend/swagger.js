const swaggerAutogen = require('swagger-autogen')();

const doc = {
  info: {
    title: 'FlowState API',
    description: 'Documentation automatique de l\'API REST FlowState',
  },
  host: 'localhost:5001',
  basePath: '/api',
  schemes: ['http', 'https'],
};

const outputFile = './swagger-output.json';
const routes = [
  './routes/auth.js',
  './routes/habitudes.js',
  './routes/sessions.js',
  './routes/videos.js',
  './routes/stats.js',
  './routes/admin.js',
];

swaggerAutogen(outputFile, routes, doc);
