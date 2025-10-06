/**
 * User Profile Regression Tests
 * @tags @regression @profile @user
 */

import { generateUser } from '../../utils/helpers';

describe('User Profile - Regression Tests', { tags: ['@regression', '@profile', '@user'] }, () => {
  let updatedUserData: any;

  beforeEach(() => {
    // Login before each test
    cy.login(Cypress.env('username'), Cypress.env('password'));
    cy.visit('/profile');
    updatedUserData = generateUser();
  });

  it('should display user profile information', { tags: '@view' }, () => {
    cy.getByTestId('profile-container').should('be.visible');
    cy.getByTestId('profile-name').should('be.visible');
    cy.getByTestId('profile-email').should('be.visible');
  });

  it('should update user profile successfully', { tags: '@update' }, () => {
    // Click edit button
    cy.getByTestId('edit-profile-button').click();
    
    // Update fields
    cy.getByTestId('first-name-input').clear().type(updatedUserData.firstName);
    cy.getByTestId('last-name-input').clear().type(updatedUserData.lastName);
    cy.getByTestId('phone-input').clear().type(updatedUserData.phone);
    
    // Save changes
    cy.getByTestId('save-profile-button').click();
    
    // Verify success message
    cy.contains('Profile updated successfully').should('be.visible');
    
    // Verify updated values
    cy.getByTestId('profile-name').should('contain', updatedUserData.firstName);
  });

  it('should validate email format', { tags: '@validation' }, () => {
    cy.getByTestId('edit-profile-button').click();
    
    // Enter invalid email
    cy.getByTestId('email-input').clear().type('invalid-email');
    cy.getByTestId('save-profile-button').click();
    
    // Verify validation error
    cy.contains('Please enter a valid email').should('be.visible');
  });

  it('should change password successfully', { tags: '@security' }, () => {
    cy.getByTestId('change-password-link').click();
    
    // Fill password change form
    cy.getByTestId('current-password-input').type(Cypress.env('password'));
    cy.getByTestId('new-password-input').type('NewPassword123!');
    cy.getByTestId('confirm-password-input').type('NewPassword123!');
    
    // Submit
    cy.getByTestId('change-password-button').click();
    
    // Verify success
    cy.contains('Password changed successfully').should('be.visible');
  });

  it('should upload profile picture', { tags: '@upload' }, () => {
    cy.getByTestId('edit-profile-button').click();
    
    // Upload file (assuming a fixture file exists)
    cy.fixture('profile-picture.jpg', 'binary').then((fileContent) => {
      cy.getByTestId('profile-picture-input').attachFile({
        fileContent,
        fileName: 'profile-picture.jpg',
        mimeType: 'image/jpeg',
        encoding: 'binary',
      });
    });
    
    cy.getByTestId('save-profile-button').click();
    cy.contains('Profile updated successfully').should('be.visible');
  });

  it('should cancel profile edit without saving', { tags: '@cancel' }, () => {
    // Get current name
    cy.getByTestId('profile-name').invoke('text').then((originalName) => {
      // Edit profile
      cy.getByTestId('edit-profile-button').click();
      cy.getByTestId('first-name-input').clear().type('TempName');
      
      // Cancel
      cy.getByTestId('cancel-button').click();
      
      // Verify original name is still displayed
      cy.getByTestId('profile-name').should('have.text', originalName);
    });
  });

  it('should delete account with confirmation', { tags: ['@delete', '@critical'] }, () => {
    cy.getByTestId('account-settings-link').click();
    cy.getByTestId('delete-account-button').click();
    
    // Confirm deletion
    cy.getByTestId('confirm-delete-input').type('DELETE');
    cy.getByTestId('confirm-delete-button').click();
    
    // Verify redirect to homepage
    cy.url().should('eq', Cypress.config('baseUrl') + '/');
  });
});

