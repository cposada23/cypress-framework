/**
 * Base Page Object Model class
 * All page classes should extend this base class
 */
export class BasePage {
  protected url: string;

  constructor(url: string = '') {
    this.url = url;
  }

  /**
   * Navigate to the page
   */
  visit(): void {
    cy.visit(this.url);
  }

  /**
   * Get element by selector
   */
  getElement(selector: string): Cypress.Chainable<JQuery<HTMLElement>> {
    return cy.get(selector);
  }

  /**
   * Get element by test ID
   */
  getByTestId(testId: string): Cypress.Chainable<JQuery<HTMLElement>> {
    return cy.get(`[data-testid="${testId}"]`);
  }

  /**
   * Get element by text content
   */
  getByText(text: string): Cypress.Chainable<JQuery<HTMLElement>> {
    return cy.contains(text);
  }

  /**
   * Click element
   */
  click(selector: string): void {
    this.getElement(selector).click();
  }

  /**
   * Type text into input field
   */
  type(selector: string, text: string): void {
    this.getElement(selector).clear().type(text);
  }

  /**
   * Wait for element to be visible
   */
  waitForVisible(selector: string, timeout: number = 10000): Cypress.Chainable<JQuery<HTMLElement>> {
    return this.getElement(selector).should('be.visible', { timeout });
  }

  /**
   * Check if element is visible
   */
  isVisible(selector: string): Cypress.Chainable<boolean> {
    return this.getElement(selector).should('be.visible').then(() => true);
  }

  /**
   * Get page title
   */
  getTitle(): Cypress.Chainable<string> {
    return cy.title();
  }

  /**
   * Get current URL
   */
  getCurrentUrl(): Cypress.Chainable<string> {
    return cy.url();
  }

  /**
   * Wait for page load
   */
  waitForPageLoad(): void {
    cy.window().should('have.property', 'document');
  }

  /**
   * Scroll to element
   */
  scrollToElement(selector: string): void {
    this.getElement(selector).scrollIntoView();
  }

  /**
   * Take screenshot
   */
  screenshot(name: string): void {
    cy.screenshot(name);
  }
}

