export interface RateLimitConfig {
  strategy: 'fixed-window' | 'sliding-window' | 'token-bucket';
  requestCount: number;
  timeWindow: number; // in milliseconds
  maxQueueSize?: number;
}

export interface RegisteredApp {
  id: string;
  userId: string;
  name: string;
  baseUrl: string;
  rateLimitConfig: RateLimitConfig;
  createdAt: Date;
  updatedAt: Date;
}

export interface User {
  id: string;
  email: string;
  password: string;
  apiKey: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface QueuedRequest {
  id: string;
  appId: string;
  timestamp: number;
  request: {
    method: string;
    path: string;
    headers: Record<string, string>;
    body: any;
  };
} 