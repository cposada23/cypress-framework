/**
 * E2E Checkout Flow Integration Tests
 * @tags @integration @e2e @checkout
 */

import { generateUser, generateProduct } from '../../utils/helpers';

describe('Checkout Flow - Integration Tests', { tags: ['@integration', '@e2e', '@checkout'] }, () => {
  let testUser: any;
  let testProduct: any;

  before(() => {
    // Generate test data
    testUser = generateUser();
    testProduct = generateProduct();
  });

  beforeEach(() => {
    // Setup: Login before each test
    cy.login(Cypress.env('username'), Cypress.env('password'));
  });

  it('should complete full checkout process', { tags: ['@smoke', '@critical'] }, () => {
    // Step 1: Browse products
    cy.visit('/products');
    cy.waitForElement('[data-testid="product-list"]');
    
    // Step 2: Add product to cart
    cy.getByTestId('product-card').first().click();
    cy.getByTestId('add-to-cart-button').click();
    cy.contains('Added to cart').should('be.visible');
    
    // Step 3: View cart
    cy.getByTestId('cart-icon').click();
    cy.url().should('include', '/cart');
    cy.getByTestId('cart-item').should('have.length.at.least', 1);
    
    // Step 4: Proceed to checkout
    cy.getByTestId('checkout-button').click();
    cy.url().should('include', '/checkout');
    
    // Step 5: Fill shipping information
    cy.getByTestId('shipping-address-input').type(testUser.address.street);
    cy.getByTestId('shipping-city-input').type(testUser.address.city);
    cy.getByTestId('shipping-zipcode-input').type(testUser.address.zipCode);
    cy.getByTestId('continue-to-payment-button').click();
    
    // Step 6: Fill payment information
    cy.getByTestId('card-number-input').type('4111111111111111');
    cy.getByTestId('card-expiry-input').type('12/25');
    cy.getByTestId('card-cvc-input').type('123');
    
    // Step 7: Place order
    cy.getByTestId('place-order-button').click();
    
    // Step 8: Verify order confirmation
    cy.url().should('include', '/order-confirmation');
    cy.contains('Order placed successfully').should('be.visible');
    cy.getByTestId('order-number').should('be.visible');
  });

  it('should persist cart items across sessions', { tags: '@cart' }, () => {
    // Add item to cart
    cy.visit('/products');
    cy.getByTestId('product-card').first().click();
    cy.getByTestId('add-to-cart-button').click();
    
    // Get cart count
    cy.getByTestId('cart-count').invoke('text').then((count) => {
      const itemCount = parseInt(count);
      
      // Reload page
      cy.reload();
      
      // Verify cart persists
      cy.getByTestId('cart-count').should('have.text', itemCount.toString());
    });
  });

  it('should calculate correct total with multiple items', { tags: '@calculation' }, () => {
    // Add multiple items
    cy.visit('/products');
    cy.getByTestId('product-card').eq(0).click();
    cy.getByTestId('add-to-cart-button').click();
    cy.visit('/products');
    
    cy.getByTestId('product-card').eq(1).click();
    cy.getByTestId('add-to-cart-button').click();
    
    // Go to cart
    cy.getByTestId('cart-icon').click();
    
    // Verify total calculation
    let expectedTotal = 0;
    cy.getByTestId('cart-item-price').each(($el) => {
      const price = parseFloat($el.text().replace('$', ''));
      expectedTotal += price;
    }).then(() => {
      cy.getByTestId('cart-total').invoke('text').then((totalText) => {
        const total = parseFloat(totalText.replace('$', ''));
        expect(total).to.be.closeTo(expectedTotal, 0.01);
      });
    });
  });

  it('should handle empty cart checkout gracefully', { tags: '@negative' }, () => {
    // Navigate to cart
    cy.visit('/cart');
    
    // Try to checkout with empty cart
    cy.getByTestId('checkout-button').should('be.disabled');
    cy.contains('Your cart is empty').should('be.visible');
  });
});

