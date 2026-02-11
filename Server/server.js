const express = require('express');
const dotenv = require('dotenv');
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const connectDB = require('./config/db');
const logger = require('./utils/logger');

// 1. Load & Validate Environment
dotenv.config();
const requiredEnv = ['MONGO_URI', 'JWT_SECRET'];
requiredEnv.forEach((env) => {
  if (!process.env[env]) {
    logger.error(`FATAL: Environment variable ${env} is missing.`);
    process.exit(1);
  }
});

if (process.env.NODE_ENV === 'production' && !process.env.CORS_ORIGINS) {
  logger.error('FATAL: CORS_ORIGINS is required in production.');
  process.exit(1);
}

connectDB();

const app = express();

// Respect proxy headers (required for accurate IP-based rate limiting behind reverse proxies).
app.set('trust proxy', 1);

// 2. Security Middleware
app.use(helmet()); // Set secure HTTP headers
app.use(mongoSanitize()); // Sanitize MongoDB queries
app.use(express.json({ limit: '10kb' })); // Body limit to prevent DOS

// 3. Hardened CORS
const allowedOrigins = (process.env.CORS_ORIGINS || '')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

const corsOptions = {
  origin: function (origin, callback) {
    // Allow server-to-server and local CLI requests with no origin.
    if (!origin) {
      return callback(null, true);
    }

    if (process.env.NODE_ENV !== 'production') {
      // Allow localhost with any port during development.
      if (origin.includes('localhost') || origin.includes('127.0.0.1')) {
        return callback(null, true);
      }
      return callback(new Error('Not allowed by CORS'));
    }

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    return callback(new Error('Not allowed by CORS'));
  },
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
  credentials: true,
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

// 4. Rate Limiting
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: process.env.NODE_ENV === 'production' ? 100 : 300,
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  skipSuccessfulRequests: true,
  message: 'Too many authentication attempts. Please try again later.',
  standardHeaders: true,
  legacyHeaders: false
});

app.use('/api/', apiLimiter);
app.use('/api/auth/login', authLimiter);
app.use('/api/auth/register', authLimiter);

// 5. Routes
app.use('/api/auth', require('./routes/users'));
app.use('/api/transactions', require('./routes/transactions'));
app.use('/api/budget', require('./routes/budget'));

// 6. Global Error Handler
app.use((err, req, res, next) => {
  logger.error(`${err.status || 500} - ${err.message} - ${req.originalUrl} - ${req.ip}`);
  res.status(err.status || 500).json({
    success: false,
    error: process.env.NODE_ENV === 'production' ? 'Server Error' : err.message
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  logger.info(`🚀 Fintech Server running on port ${PORT} in ${process.env.NODE_ENV} mode`);
});
