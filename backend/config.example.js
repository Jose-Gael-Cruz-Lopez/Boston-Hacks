// Copy this file to config.js and update with your values
module.exports = {
  // Server Configuration
  PORT: process.env.PORT || 4000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  
  // Frontend URL for CORS
  FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:3000',
  
  // Debug Configuration
  DEBUG_LEVEL: process.env.DEBUG_LEVEL || 'info',
  DEBUG_SERVICES: process.env.DEBUG_SERVICES === 'true',
  
  // Add your custom configuration here
  // DATABASE_URL: process.env.DATABASE_URL,
  // JWT_SECRET: process.env.JWT_SECRET,
  // API_KEY: process.env.API_KEY,
};
