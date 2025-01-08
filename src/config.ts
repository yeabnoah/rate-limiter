import dotenv from 'dotenv';

dotenv.config();

interface Config {
  server: {
    port: string | number;
  };
  redis: {
    url: string;
  };
  mongodb: {
    url: string;
  };
}

export const config: Config = {
  server: {
    port: process.env.PORT || 3000
  },
  redis: {
    url: process.env.REDIS_URL || 'redis://localhost:6379'
  },
  mongodb: {
    url: process.env.MONGODB_URL || 'mongodb://localhost:27017/rate-limiter'
  }
}; 