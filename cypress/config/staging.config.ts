export default {
  baseUrl: 'https://staging.example.com',
  env: {
    apiUrl: 'https://staging.example.com/api',
    environment: 'staging',
    username: process.env.STAGING_USERNAME || 'test@example.com',
    password: process.env.STAGING_PASSWORD || 'TestPassword123!',
  },
};

