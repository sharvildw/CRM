require('dotenv').config();

module.exports = {
  port: process.env.PORT || 5000,
  mongoURI: process.env.MONGODB_URI || 'mongodb://localhost:27017/crm_db',
  jwtSecret: process.env.JWT_SECRET || 'crm_default_secret',
  jwtExpire: process.env.JWT_EXPIRE || '7d',
  nodeEnv: process.env.NODE_ENV || 'development',
  clientURL: process.env.CLIENT_URL || 'http://localhost:3000',
};
