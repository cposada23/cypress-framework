import { defineConfig } from 'cypress';
import * as dotenv from 'dotenv';
import registerCypressGrep from '@cypress/grep/src/plugin';
import cypressMochawesomeReporter from 'cypress-mochawesome-reporter/plugin';

// Load environment variables from .env file
dotenv.config();

export default defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // Register cypress-grep plugin for test filtering by tags
      registerCypressGrep(config);
      
      // Register mochawesome reporter
      cypressMochawesomeReporter(on);
      
      // Load environment-specific configuration
      const environment = config.env.environment || 'local';
      const envConfig = require(`./cypress/config/${environment}.config`);
      
      // Merge environment config with base config
      config.baseUrl = envConfig.baseUrl;
      config.env = { ...config.env, ...envConfig.env };
      
      return config;
    },
    specPattern: 'cypress/e2e/**/*.cy.{js,jsx,ts,tsx}',
    supportFile: 'cypress/support/e2e.ts',
    fixturesFolder: 'cypress/fixtures',
    screenshotsFolder: 'cypress/screenshots',
    videosFolder: 'cypress/videos',
    video: true,
    screenshotOnRunFailure: true,
    viewportWidth: 1920,
    viewportHeight: 1080,
    defaultCommandTimeout: 10000,
    requestTimeout: 10000,
    responseTimeout: 10000,
    pageLoadTimeout: 60000,
    retries: {
      runMode: 2,
      openMode: 0
    },
    // Reporter configuration
    reporter: 'cypress-multi-reporters',
    reporterOptions: {
      configFile: 'reporter-config.json',
    },
    experimentalMemoryManagement: true,
    numTestsKeptInMemory: 0,
  },
  env: {
    grepFilterSpecs: true,
    grepOmitFiltered: true,
  },
});

