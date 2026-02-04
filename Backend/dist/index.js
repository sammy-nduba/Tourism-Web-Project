import dotenv from 'dotenv';
dotenv.config({ path: './.env' });
console.log('dotenv config called, cwd:', process.cwd());
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import morgan from 'morgan';
import toursRouter from './routes/tours.js';
import countriesRouter from './routes/countries.js';
import searchRouter from './routes/search.js';
import { errorHandler } from './middleware/errorHandler.js';
import { notFoundHandler } from './middleware/notFoundHandler.js';
const app = express();
const PORT = process.env.PORT || 3000;
if (process.env.HELMET_ENABLED !== 'false') {
    app.use(helmet());
}
const defaultAllowedOrigins = [
    'https://horizontourists.netlify.app',
    'http://localhost:5173',
    'http://localhost:5174',
];
const envAllowedOrigins = (process.env.FRONTEND_URL || '')
    .split(',')
    .map((o) => o.trim())
    .filter(Boolean);
const allowedOrigins = new Set([...defaultAllowedOrigins, ...envAllowedOrigins]);
const corsOptions = {
    origin: (origin, callback) => {
        if (!origin)
            return callback(null, true);
        if (allowedOrigins.has(origin))
            return callback(null, true);
        return callback(new Error(`CORS blocked origin: ${origin}`));
    },
    credentials: true,
    optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));
app.set('trust proxy', 1);
const limiter = rateLimit({
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'),
    max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'),
    message: {
        error: 'Too many requests from this IP, please try again later.'
    },
    standardHeaders: true,
    legacyHeaders: false,
});
app.use(limiter);
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(compression());
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}
else {
    app.use(morgan('combined'));
}
app.get('/', (req, res) => {
    res.json({
        message: 'Wild Horizon API is running 🚀',
        health: '/health'
    });
});
app.get('/health', (req, res) => {
    res.json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development'
    });
});
app.use('/api/tours', toursRouter);
app.use('/api/countries', countriesRouter);
app.use('/api/search', searchRouter);
app.get('/api/tours/health-check', (req, res) => {
    res.json({
        status: 'API is running',
        timestamp: new Date().toISOString(),
        supabaseConfigured: !!(process.env.SUPABASE_URL && process.env.SUPABASE_ANON_KEY),
    });
});
app.use(notFoundHandler);
app.use(errorHandler);
app.listen(PORT, () => {
    console.log(`🚀 Wild Horizon API Server running on port ${PORT}`);
    console.log(`📊 Health check: http://localhost:${PORT}/health`);
    console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
});
export default app;
