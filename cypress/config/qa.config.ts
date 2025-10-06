export default {
  baseUrl: 'https://qa.example.com',
  env: {
    apiUrl: 'https://qa.example.com/api',
    environment: 'qa',
    username: process.env.QA_USERNAME || 'test@example.com',
    password: process.env.QA_PASSWORD || 'TestPassword123!',
  },
};

