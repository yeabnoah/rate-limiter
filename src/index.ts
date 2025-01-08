import express from 'express';
import mongoose from 'mongoose';
import { config } from './config';
import authRoutes from './routes/auth';
import appRoutes from './routes/apps';
import { createAppProxy } from './middleware/proxy';
import { authenticateApiKey } from './middleware/auth';

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to MongoDB
mongoose.connect(config?.mongodb?.url)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

// Routes
app.use('/auth', authRoutes);
app.use('/apps', appRoutes);

// Proxy endpoint
app.use('/apis/:appId/*', authenticateApiKey, createAppProxy);

// Error handling
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Internal Server Error',
    message: 'Something went wrong'
  });
});

// Start server
const PORT = config?.server?.port || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
