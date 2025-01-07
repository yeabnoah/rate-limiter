import { createProxyMiddleware } from 'http-proxy-middleware';
import { config } from '../config';

export const proxyMiddleware = createProxyMiddleware({
  target: config.targetApi.url,
  changeOrigin: true,
  pathRewrite: {
    '^/api/': '/' 
  },
  onProxyReq: (proxyReq, req, res) => {
    proxyReq.setHeader('X-Proxy-Timestamp', Date.now().toString());
  },
  onError: (err, req, res) => {
    console.error('Proxy Error:', err);
    res.status(500).json({
      error: 'Proxy Error',
      message: 'Failed to forward request to target API'
    });
  }
}); 