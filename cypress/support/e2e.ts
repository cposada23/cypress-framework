// Import commands
import './commands';
import '@cypress/grep';
import 'cypress-mochawesome-reporter/register';

// Global configuration and hooks
beforeEach(() => {
  // Clear cookies and local storage before each test
  cy.clearCookies();
  cy.clearLocalStorage();
});

// Preserve session cookies if needed
Cypress.Cookies.debug(false);

// Custom error handling
Cypress.on('uncaught:exception', (err, runnable) => {
  // Returning false here prevents Cypress from failing the test
  // You can add specific error handling logic here
  console.error('Uncaught exception:', err.message);
  return false;
});

// Screenshot on failure
Cypress.on('fail', (error, runnable) => {
  throw error;
});

