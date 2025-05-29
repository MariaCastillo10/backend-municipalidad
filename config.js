// backend/config.js
require('dotenv').config();

module.exports = {
  port: process.env.PORT,
  mongoUri: process.env.MONGO_URI,
  jwtSecret: process.env.JWT_SECRET,
  openaiApiKey: process.env.OPENAI_API_KEY,
  judge0ApiUrl: process.env.JUDGE0_API_URL,
  judge0ApiKey: process.env.JUDGE0_API_KEY,
  openaiOrgId: process.env.OPENAI_ORG_ID,
  openaiProjectId: process.env.OPENAI_PROJECT_ID,
  email: process.env.EMAIL_USER,
  password: process.env.EMAIL_PASS,
  frontend_url: process.env.FRONTEND_URL,
  sendgrid_api_key: process.env.SENDGRID_API_KEY
};