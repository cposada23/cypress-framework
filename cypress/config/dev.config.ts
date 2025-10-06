export default {
  baseUrl: 'https://dev.example.com',
  env: {
    apiUrl: 'https://dev.example.com/api',
    environment: 'dev',
    username: process.env.DEV_USERNAME || 'test@example.com',
    password: process.env.DEV_PASSWORD || 'TestPassword123!',
  },
};

