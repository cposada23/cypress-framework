/// <reference types="cypress" />

declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * Custom command to get element by data-testid
       * @param testId - Test ID value
       * @example cy.getByTestId('submit-button')
       */
      getByTestId(testId: string): Chainable<JQuery<HTMLElement>>;

      /**
       * Custom command to login
       * @param username - User email
       * @param password - User password
       * @example cy.login('user@example.com', 'password123')
       */
      login(username: string, password: string): Chainable<void>;

      /**
       * Custom command to make API request with authentication
       * @param method - HTTP method
       * @param url - API endpoint
       * @param body - Request body
       * @example cy.apiRequest('POST', '/api/users', { name: 'John' })
       */
      apiRequest(method: string, url: string, body?: any): Chainable<Response<any>>;

      /**
       * Custom command to wait for element to be visible and stable
       * @param selector - Element selector
       * @param timeout - Maximum wait time
       * @example cy.waitForElement('.submit-button')
       */
      waitForElement(selector: string, timeout?: number): Chainable<JQuery<HTMLElement>>;

      /**
       * Custom command to check if element exists without failing test
       * @param selector - Element selector
       * @example cy.elementExists('.optional-element').then((exists) => { ... })
       */
      elementExists(selector: string): Chainable<boolean>;

      /**
       * Custom command to generate test data
       * @param type - Type of data to generate
       * @example cy.generateTestData('user').then((user) => { ... })
       */
      generateTestData(type: string): Chainable<any>;

      /**
       * Custom command to take full page screenshot
       * @param name - Screenshot name
       * @example cy.fullPageScreenshot('homepage')
       */
      fullPageScreenshot(name: string): Chainable<void>;
    }
  }
}

/**
 * Custom command to get element by data-testid
 */
Cypress.Commands.add('getByTestId', (testId: string) => {
  return cy.get(`[data-testid="${testId}"]`);
});

/**
 * Custom command for login functionality
 */
Cypress.Commands.add('login', (username: string, password: string) => {
  cy.session([username, password], () => {
    cy.visit('/login');
    cy.get('[data-testid="email-input"]').type(username);
    cy.get('[data-testid="password-input"]').type(password);
    cy.get('[data-testid="login-button"]').click();
    cy.url().should('not.include', '/login');
  });
});

/**
 * Custom command for API requests with authentication
 */
Cypress.Commands.add('apiRequest', (method: string, url: string, body?: any) => {
  const token = Cypress.env('authToken');
  
  return cy.request({
    method,
    url: `${Cypress.env('apiUrl')}${url}`,
    body,
    headers: {
      Authorization: token ? `Bearer ${token}` : '',
      'Content-Type': 'application/json',
    },
    failOnStatusCode: false,
  });
});

/**
 * Custom command to wait for element to be visible and stable
 */
Cypress.Commands.add('waitForElement', (selector: string, timeout: number = 10000) => {
  return cy.get(selector, { timeout }).should('be.visible').should('not.be.disabled');
});

/**
 * Custom command to check if element exists
 */
Cypress.Commands.add('elementExists', (selector: string) => {
  return cy.get('body').then(($body) => {
    return $body.find(selector).length > 0;
  });
});

/**
 * Custom command to generate test data
 */
Cypress.Commands.add('generateTestData', (type: string) => {
  return cy.task('generateData', type, { timeout: 5000 });
});

/**
 * Custom command for full page screenshot
 */
Cypress.Commands.add('fullPageScreenshot', (name: string) => {
  cy.screenshot(name, {
    capture: 'fullPage',
    overwrite: true,
  });
});

export {};

