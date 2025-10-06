/**
 * Login Smoke Tests
 * @tags @smoke @login @critical
 */

describe('Login Functionality - Smoke Tests', { tags: ['@smoke', '@login', '@critical'] }, () => {
  beforeEach(() => {
    cy.visit('/login');
  });

  it('should display login page correctly', { tags: '@ui' }, () => {
    // Verify page elements
    cy.getByTestId('email-input').should('be.visible');
    cy.getByTestId('password-input').should('be.visible');
    cy.getByTestId('login-button').should('be.visible');
    cy.contains('Login').should('be.visible');
  });

  it('should login successfully with valid credentials', { tags: '@authentication' }, () => {
    const username = Cypress.env('username');
    const password = Cypress.env('password');

    // Perform login
    cy.getByTestId('email-input').type(username);
    cy.getByTestId('password-input').type(password);
    cy.getByTestId('login-button').click();

    // Verify successful login
    cy.url().should('not.include', '/login');
    cy.url().should('include', '/dashboard');
    cy.contains('Welcome').should('be.visible');
  });

  it('should show error message with invalid credentials', { tags: '@negative' }, () => {
    // Attempt login with invalid credentials
    cy.getByTestId('email-input').type('invalid@example.com');
    cy.getByTestId('password-input').type('wrongpassword');
    cy.getByTestId('login-button').click();

    // Verify error message
    cy.contains('Invalid credentials').should('be.visible');
    cy.url().should('include', '/login');
  });

  it('should validate required fields', { tags: '@validation' }, () => {
    // Click login without entering credentials
    cy.getByTestId('login-button').click();

    // Verify validation messages
    cy.contains('Email is required').should('be.visible');
    cy.contains('Password is required').should('be.visible');
  });
});

