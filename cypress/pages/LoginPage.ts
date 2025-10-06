import { BasePage } from './BasePage';

/**
 * Login Page Object Model
 * Example implementation of Page Object pattern
 */
export class LoginPage extends BasePage {
  constructor() {
    super('/login');
  }

  // Selectors (using getters for lazy evaluation)
  private get emailInput(): Cypress.Chainable<JQuery<HTMLElement>> {
    return this.getByTestId('email-input');
  }

  private get passwordInput(): Cypress.Chainable<JQuery<HTMLElement>> {
    return this.getByTestId('password-input');
  }

  private get loginButton(): Cypress.Chainable<JQuery<HTMLElement>> {
    return this.getByTestId('login-button');
  }

  private get forgotPasswordLink(): Cypress.Chainable<JQuery<HTMLElement>> {
    return this.getByText('Forgot Password?');
  }

  private get signUpLink(): Cypress.Chainable<JQuery<HTMLElement>> {
    return this.getByText('Sign Up');
  }

  private get errorMessage(): Cypress.Chainable<JQuery<HTMLElement>> {
    return this.getElement('[data-testid="error-message"]');
  }

  private get rememberMeCheckbox(): Cypress.Chainable<JQuery<HTMLElement>> {
    return this.getByTestId('remember-me-checkbox');
  }

  // Actions
  /**
   * Perform login with provided credentials
   */
  login(email: string, password: string, rememberMe: boolean = false): void {
    this.emailInput.clear().type(email);
    this.passwordInput.clear().type(password);
    
    if (rememberMe) {
      this.rememberMeCheckbox.check();
    }
    
    this.loginButton.click();
  }

  /**
   * Navigate to login page and verify it loaded
   */
  visitAndVerify(): void {
    this.visit();
    this.verifyLoginPageLoaded();
  }

  /**
   * Click forgot password link
   */
  clickForgotPassword(): void {
    this.forgotPasswordLink.click();
  }

  /**
   * Click sign up link
   */
  clickSignUp(): void {
    this.signUpLink.click();
  }

  /**
   * Fill email field
   */
  enterEmail(email: string): void {
    this.emailInput.clear().type(email);
  }

  /**
   * Fill password field
   */
  enterPassword(password: string): void {
    this.passwordInput.clear().type(password);
  }

  /**
   * Click login button
   */
  clickLogin(): void {
    this.loginButton.click();
  }

  // Assertions
  /**
   * Verify login page is loaded correctly
   */
  verifyLoginPageLoaded(): void {
    this.emailInput.should('be.visible');
    this.passwordInput.should('be.visible');
    this.loginButton.should('be.visible');
    this.getTitle().should('include', 'Login');
  }

  /**
   * Verify error message is displayed
   */
  verifyErrorMessage(expectedMessage?: string): void {
    this.errorMessage.should('be.visible');
    if (expectedMessage) {
      this.errorMessage.should('contain', expectedMessage);
    }
  }

  /**
   * Verify login button is disabled
   */
  verifyLoginButtonDisabled(): void {
    this.loginButton.should('be.disabled');
  }

  /**
   * Verify login button is enabled
   */
  verifyLoginButtonEnabled(): void {
    this.loginButton.should('not.be.disabled');
  }

  /**
   * Verify validation message for email field
   */
  verifyEmailValidation(message: string): void {
    this.emailInput.then(($input) => {
      expect($input[0].validationMessage).to.include(message);
    });
  }
}

