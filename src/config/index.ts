import dotenv from 'dotenv';
dotenv.config();

export const config = {
  port: process.env.PORT || 3000,
  redis: {
    url: process.env.REDIS_URL || 'redis://localhost:6379'
  },
  rateLimit: {
    defaultLimit: parseInt(process.env.DEFAULT_RATE_LIMIT || '100'),
    defaultTimeWindow: parseInt(process.env.DEFAULT_TIME_WINDOW || '60000')
  },
  targetApi: {
    url: process.env.TARGET_API_URL || 'https://api.example.com'
  }
}; 