declare module 'cypress-mochawesome-reporter/plugin' {
  const cypressMochawesomeReporter: any;
  export default cypressMochawesomeReporter;
}

declare module 'cypress-mochawesome-reporter/register';

declare module '@cypress/grep/src/plugin' {
  const registerCypressGrep: any;
  export default registerCypressGrep;
}

declare namespace Cypress {
  interface SuiteConfigOverrides {
    tags?: string | string[];
  }
  
  interface TestConfigOverrides {
    tags?: string | string[];
  }
}

