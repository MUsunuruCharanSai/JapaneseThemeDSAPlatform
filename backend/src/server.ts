import dotenv from 'dotenv';

dotenv.config();

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import cookieParser from 'cookie-parser';

import authRoutes from './routes/auth';
import dsaRoutes from './routes/dsa';
import paymentRoutes from './routes/payment';

const app = express();
const PORT = process.env.PORT || 5000;

app.use((req, _res, next) => {
  const headerPath = [
    req.headers['x-forwarded-uri'],
    req.headers['x-invoke-path'],
    req.headers['x-vercel-original-url'],
  ].find((value): value is string => typeof value === 'string' && value.length > 0);

  if (headerPath) {
    const [pathname, search] = headerPath.split('?');
    if (pathname.startsWith('/api')) {
      req.url = search ? `${pathname}?${search}` : pathname;
      next();
      return;
    }
  }

  const url = req.url || '';
  if (url !== '/' && !url.startsWith('/api')) {
    const q = url.indexOf('?');
    const pathname = q === -1 ? url : url.slice(0, q);
    const query = q === -1 ? '' : url.slice(q);
    req.url = `/api${pathname.startsWith('/') ? pathname : `/${pathname}`}${query}`;
  }
  next();
});

if (!process.env.VERCEL) {
  app.use(helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'"],
        imgSrc: ["'self'", "data:", "https:"],
      },
    },
  }));
}

if (!process.env.VERCEL) {
  app.use(rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: 'Too many requests from this IP, please try again later.',
  }));
}

app.use(cors({
  origin: true,
  credentials: true,
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

app.get(['/health', '/api/health'], (_req, res) => {
  res.status(200).json({ status: 'OK', message: 'Server is running' });
});

app.use('/api/auth', authRoutes);
app.use('/api/dsa', dsaRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/auth', authRoutes);
app.use('/dsa', dsaRoutes);
app.use('/payment', paymentRoutes);

app.use('*', (req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
});

if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

export default app;
