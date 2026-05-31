import dotenv from 'dotenv';
dotenv.config();

console.log('=== TEST SCRIPT: RUNTIME ENVIRONMENT ===');
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('DEV_DATABASE_URL:', process.env.DEV_DATABASE_URL ? `${process.env.DEV_DATABASE_URL.substring(0, 40)}...` : 'NOT SET');
console.log('PROD_DATABASE_URL:', process.env.PROD_DATABASE_URL ? `${process.env.PROD_DATABASE_URL.substring(0, 40)}...` : 'NOT SET');
console.log('Current DATABASE_URL before override:', process.env.DATABASE_URL ? `${process.env.DATABASE_URL.substring(0, 40)}...` : 'NOT SET');

const isProd = process.env.NODE_ENV === 'production';
const finalDatabaseUrl = isProd 
  ? (process.env.PROD_DATABASE_URL || process.env.DATABASE_URL)
  : (process.env.DEV_DATABASE_URL || process.env.DATABASE_URL);

console.log('=== FINAL SETTINGS ===');
console.log('isProd:', isProd);
console.log('Final DB URL:', finalDatabaseUrl ? `${finalDatabaseUrl.substring(0, 40)}...` : 'NOT SET');