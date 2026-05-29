import express from 'express';
import dotenv from 'dotenv';
dotenv.config();

console.log("Backend - process.env.DATABASE_URL:", process.env.DATABASE_URL);
console.log("Backend - process.env.DIRECT_URL:", process.env.DIRECT_URL);

import { corsMiddleware } from './middleware';
import { API_PREFIX, DEFAULT_PORT, DEFAULT_HOST } from './constants';

// Routes
import authRoutes from './routes/auth';
import userRoutes from './routes/users';
import propertyRoutes from './routes/properties';
import cohostRoutes from './routes/cohosts';
import jobRoutes from './routes/jobs';
import adminRoutes from './routes/admin';
import uploadRoutes from './routes/uploads';
import interviewRoutes from './routes/interviews';
import serviceRoutes from './routes/services';
import engagementRoutes from './routes/engagements';

const host = process.env.HOST ?? DEFAULT_HOST;
const port = process.env.PORT ? Number(process.env.PORT) : DEFAULT_PORT;

const app = express();

app.use(express.json());
app.use(corsMiddleware);

app.get('/', (req, res) => {
  res.send({ message: 'Hostinly API is running' });
});

app.use(`${API_PREFIX}/auth`, authRoutes);
app.use(`${API_PREFIX}/users`, userRoutes);
app.use(`${API_PREFIX}/properties`, propertyRoutes);
app.use(`${API_PREFIX}/cohosts`, cohostRoutes);
app.use(`${API_PREFIX}/jobs`, jobRoutes);
app.use(`${API_PREFIX}/admin`, adminRoutes);
app.use(`${API_PREFIX}/uploads`, uploadRoutes);
app.use(`${API_PREFIX}/interviews`, interviewRoutes);
app.use(`${API_PREFIX}/services`, serviceRoutes);
app.use(`${API_PREFIX}/engagements`, engagementRoutes);

// Global Error Handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('[ Error ]', err);
  res.status(err.status || 500).json({
    success: false,
    error: err.message || 'Internal Server Error',
    data: null
  });
});

app.listen(port, host, () => {
  console.log(`[ ready ] http://${host}:${port}`);
});
