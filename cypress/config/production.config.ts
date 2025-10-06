export default {
  baseUrl: 'https://www.example.com',
  env: {
    apiUrl: 'https://www.example.com/api',
    environment: 'production',
    username: process.env.PROD_USERNAME || '',
    password: process.env.PROD_PASSWORD || '',
  },
};

