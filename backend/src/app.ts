import express from 'express';
import cors from 'cors';
import authRoutes from './modules/auth/auth.routes';
import leadsRoutes from './modules/leads/leads.routes';
import quotationsRoutes from './modules/quotations/quotations.routes';
import dashboardRoutes from './modules/dashboard/dashboard.routes';
import companiesRoutes from './modules/companies/companies.routes';
import superAdminRoutes from './modules/superadmin/superadmin.routes';
import { errorHandler } from './middleware/errorHandler';
import { requestLogger } from './middleware/requestLogger';
import { env } from './config/env';

const app = express();

app.use(requestLogger);

// CORS — allow all for testing
app.use(cors({
  origin: (origin, callback) => {
    if (!origin) {
      callback(null, true);
      return;
    }

    if (env.corsOrigins.length === 0 && env.nodeEnv !== 'production') {
      callback(null, true);
      return;
    }

    callback(null, env.corsOrigins.includes(origin));
  },
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Feature routes
app.use('/api/auth', authRoutes);
app.use('/api/leads', leadsRoutes);
app.use('/api/quotes', quotationsRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/companies', companiesRoutes);
app.use('/api/superadmin', superAdminRoutes);

// Global error handler (must be last)
app.use(errorHandler);

export default app;
