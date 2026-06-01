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
  // --- PRODUCTION MODE: NO FALLBACKS, NO MERCY ---
  console.log('=== PRODUCTION MODE ACTIVE ===');
  if (!prodDbUrl) {
    console.error('❌ FATAL: PROD_DATABASE_URL is NOT SET in production!');
    process.exit(1);
  }
  if (!prodDirectUrl) {
    console.error('❌ FATAL: PROD_DIRECT_URL is NOT SET in production!');
    process.exit(1);
  }
  // Check for DEV DB prefix in prod URL (just to be 100% safe!)
  if (prodDbUrl.includes('dd9633bbae04474f')) {
    console.error('❌ FATAL: PROD_DATABASE_URL contains DEV DB credentials!');
    process.exit(1);
  }
  finalDatabaseUrl = prodDbUrl;
  finalDirectUrl = prodDirectUrl;
} else {
  // --- DEVELOPMENT MODE ---
  console.log('=== DEVELOPMENT MODE ACTIVE ===');
  finalDatabaseUrl = devDbUrl || sanitizeEnvVar(process.env.DATABASE_URL);
  finalDirectUrl = devDirectUrl || sanitizeEnvVar(process.env.DIRECT_URL);
}

console.log('=== FINAL DB CONFIGURATION ===');
console.log('Final DATABASE_URL:', finalDatabaseUrl ? `${finalDatabaseUrl.substring(0, 40)}...` : 'NOT SET');
console.log('Final DIRECT_URL:', finalDirectUrl ? `${finalDirectUrl.substring(0, 40)}...` : 'NOT SET');

// LAST LINE OF DEFENSE
if (isProd && (!finalDatabaseUrl || finalDatabaseUrl.includes('dd9633bbae04474f'))) {
  console.error('❌ CRITICAL: LAST CHECK FAILED - USING DEV DB IN PROD!');
  process.exit(1);
}

console.log('✅ ALL TESTS PASSED!');