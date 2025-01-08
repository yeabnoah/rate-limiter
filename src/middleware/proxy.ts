import { Request, Response, NextFunction } from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { RegisteredAppModel } from '../models/RegisteredApp';
import { rateLimiter } from './ratelimiter';
import { AuthenticatedRequest } from './auth';

export const createAppProxy = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const appId = req.params.appId;
    const userId = req.user?.id;

    const app = await RegisteredAppModel.findOne({ id: appId, userId });

    if (!app) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'App not found'
      });
    }

    // Apply rate limiting middleware
    const limiter = rateLimiter({
      limit: app.rateLimitConfig.requestCount,
      timeWindow: app.rateLimitConfig.timeWindow
    });

    // Apply rate limiting before proxying
    await limiter(req, res, () => {
      const proxy = createProxyMiddleware({
        target: app.baseUrl,
        changeOrigin: true,
        pathRewrite: {
          [`^/apis/${appId}`]: '',
        },
        onProxyReq: (proxyReq, req) => {
          // Copy original request body
          if (req.body) {
            const bodyData = JSON.stringify(req.body);
            proxyReq.setHeader('Content-Type', 'application/json');
            proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyData));
            proxyReq.write(bodyData);
          }
        },
        onError: (err, req, res) => {
          console.error('Proxy error:', err);
          res.status(500).json({
            error: 'Proxy Error',
            message: 'An error occurred while proxying the request'
          });
        }
      });

      proxy(req, res, next);
    });
  } catch (error) {
    console.error('Proxy middleware error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'An error occurred in the proxy middleware'
    });
  }
}; 