const app = require('./app');
const connectDB = require('./config/db');
const config = require('./config');

const startServer = async () => {
  await connectDB();
  
  app.listen(config.port, () => {
    console.log(`\n🚀 CRM Server running in ${config.nodeEnv} mode on port ${config.port}`);
    console.log(`📡 API: http://localhost:${config.port}/api`);
    console.log(`❤️  Health: http://localhost:${config.port}/api/health\n`);
  });
};

startServer().catch(err => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
