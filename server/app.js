const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const config = require('./config');
const errorHandler = require('./middleware/errorHandler');

const app = express();

// Middleware
app.use(helmet());
app.use(cors({ origin: config.clientURL, credentials: true }));
app.use(morgan('dev'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/leads', require('./routes/leadRoutes'));
app.use('/api/customers', require('./routes/customerRoutes'));
app.use('/api/deals', require('./routes/dealRoutes'));
app.use('/api/tasks', require('./routes/taskRoutes'));
app.use('/api/activities', require('./routes/activityRoutes'));
app.use('/api/communications', require('./routes/communicationRoutes'));
app.use('/api/notifications', require('./routes/notificationRoutes'));
app.use('/api/reports', require('./routes/reportRoutes'));
app.use('/api/calendar', require('./routes/calendarRoutes'));
app.use('/api/settings', require('./routes/settingRoutes'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'CRM API is running', timestamp: new Date() });
});

// Error handler
app.use(errorHandler);

module.exports = app;
