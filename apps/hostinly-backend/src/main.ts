import express from 'express';
import dotenv from 'dotenv';
import { corsMiddleware } from './middleware';
import { API_PREFIX, DEFAULT_PORT, DEFAULT_HOST } from './constants';

// Routes
import authRoutes from './routes/auth';
import userRoutes from './routes/users';
import propertyRoutes from './routes/properties';
import cohostRoutes from './routes/cohosts';
import jobRoutes from './routes/jobs';
import adminRoutes from './routes/admin';

dotenv.config();

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

app.listen(port, host, () => {
  console.log(`[ ready ] http://${host}:${port}`);
});
