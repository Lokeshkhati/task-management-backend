import "dotenv/config";

interface Config {
    SERVICE_NAME: string;
    PORT: number;
    DATABASE_URL: string;
    JWT_SECRET: string;
    JWT_EXPIRES_IN: string;
    LOG_LEVEL: string;
    ALLOWED_ORIGINS: string;
  }
  
  export const config: Config = {
    SERVICE_NAME: process.env.SERVICE_NAME || 'task-management',
    PORT: Number(process.env.PORT) || 3001,
    DATABASE_URL:
      process.env.DATABASE_URL || 'postgres://user:password@localhost:5432/auth',
    JWT_SECRET: process.env.JWT_SECRET || 'your-default-secret-key',
    JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '24h',
    LOG_LEVEL: process.env.LOG_LEVEL || 'info',
    ALLOWED_ORIGINS: process.env.ALLOWED_ORIGINS || 'http://localhost:3000',
  };