import dotenv from 'dotenv';
dotenv.config();

// Helper to sanitize env vars (trim, remove quotes)
const sanitizeEnvVar = (value: string | undefined): string | undefined => {
  if (!value) return undefined;
  return value.trim().replace(/^["']|["']$/g, '');
};

// --- SANITIZE AND LOG ENV ---
const rawNodeEnv = process.env.NODE_ENV;
const rawDevDbUrl = process.env.DEV_DATABASE_URL;
const rawProdDbUrl = process.env.PROD_DATABASE_URL;
const rawDirectUrl = process.env.DIRECT_URL;
const rawDevDirectUrl = process.env.DEV_DIRECT_URL;
const rawProdDirectUrl = process.env.PROD_DIRECT_URL;

const nodeEnv = sanitizeEnvVar(rawNodeEnv) || 'development';
const isProd = nodeEnv === 'production';
const devDbUrl = sanitizeEnvVar(rawDevDbUrl);
const prodDbUrl = sanitizeEnvVar(rawProdDbUrl);
const directUrl = sanitizeEnvVar(rawDirectUrl);
const devDirectUrl = sanitizeEnvVar(rawDevDirectUrl);
const prodDirectUrl = sanitizeEnvVar(rawProdDirectUrl);

console.log('=== RAW SANITIZED ENVIRONMENT ===');
console.log('NODE_ENV:', nodeEnv);
console.log('isProd:', isProd);
console.log('DEV_DATABASE_URL:', devDbUrl ? `${devDbUrl.substring(0, 40)}...` : 'NOT SET');
console.log('PROD_DATABASE_URL:', prodDbUrl ? `${prodDbUrl.substring(0, 40)}...` : 'NOT SET');

// --- DETERMINE DB URLs ---
let finalDatabaseUrl: string | undefined;
let finalDirectUrl: string | undefined;

if (isProd) {
  // PRODUCTION MODE: Strict checks!
  finalDatabaseUrl = prodDbUrl || sanitizeEnvVar(process.env.DATABASE_URL);
  finalDirectUrl = prodDirectUrl || sanitizeEnvVar(process.env.DIRECT_URL);
  
  // Validate we have real prod DB URL!
  if (!finalDatabaseUrl || finalDatabaseUrl.includes('dd9633bbae04474f')) { // This is DEV DB's prefix!
    console.error('❌ PRODUCTION MODE: INVALID DATABASE URL! USING DEV DB BY ACCIDENT?');
    process.exit(1); // Crash hard to prevent prod using dev DB!
  }
} else {
  // DEVELOPMENT MODE
  finalDatabaseUrl = devDbUrl || sanitizeEnvVar(process.env.DATABASE_URL);
  finalDirectUrl = devDirectUrl || sanitizeEnvVar(process.env.DIRECT_URL);
}

// Set env vars so Prisma picks them up!
if (finalDatabaseUrl) process.env.DATABASE_URL = finalDatabaseUrl;
if (finalDirectUrl) process.env.DIRECT_URL = finalDirectUrl;

console.log('=== FINAL DB CONFIGURATION ===');
console.log('Final DATABASE_URL:', finalDatabaseUrl ? `${finalDatabaseUrl.substring(0, 40)}...` : 'NOT SET');
console.log('Final DIRECT_URL:', finalDirectUrl ? `${finalDirectUrl.substring(0, 40)}...` : 'NOT SET');

// Verify once more before importing Prisma stuff!
if (isProd && finalDatabaseUrl?.includes('dd9633bbae04474f')) {
  console.error('❌ CRITICAL ERROR: Production using dev DB!');
  process.exit(1);
}

import express from 'express';
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
