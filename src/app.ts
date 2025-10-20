import express from 'express';
import cors from 'cors';
import authRoutes from './api/auth/auth.route';
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './swagger';
import { errorMiddleware } from './core/middlewares/error.middleware';

const app = express();

app.use(cors());
app.use(express.json());

// Mount routes
app.use('/api/auth', authRoutes);

const port = process.env.PORT ? Number(process.env.PORT) : 4000;

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Global error handler (đặt cuối cùng)
app.use(errorMiddleware);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
  console.log(`API docs available at http://localhost:${port}/api-docs`);
});
