# Contributing Guide

Thank you for contributing to the Cypress Test Automation Framework! This guide will help you maintain consistency and quality across the test suite.

## 🎯 Code Standards

### Test File Naming Convention

```
<feature-name>.cy.ts
```

Examples:
- `login.cy.ts`
- `user-registration.cy.ts`
- `checkout-flow.cy.ts`

### Test Structure

```typescript
/**
 * Feature Name - Test Description
 * @tags @category @feature
 */
describe('Feature Name', { tags: ['@smoke', '@feature'] }, () => {
  // Setup
  beforeEach(() => {
    // Common setup
  });

  // Test cases
  it('should do something specific', { tags: '@subcategory' }, () => {
    // Arrange
    // Act
    // Assert
  });

  // Cleanup
  afterEach(() => {
    // Cleanup if needed
  });
});
```

## 📝 Writing Tests

### 1. Use Descriptive Test Names

❌ **Bad:**
```typescript
it('test login', () => { ... });
```

✅ **Good:**
```typescript
it('should successfully login with valid credentials', () => { ... });
```

### 2. Follow AAA Pattern (Arrange-Act-Assert)

```typescript
it('should add item to cart', () => {
  // Arrange - Setup test data and preconditions
  const product = generateProduct();
  cy.visit('/products');
  
  // Act - Perform the action
  cy.getByTestId('product-card').first().click();
  cy.getByTestId('add-to-cart').click();
  
  // Assert - Verify the outcome
  cy.getByTestId('cart-count').should('contain', '1');
  cy.contains('Item added to cart').should('be.visible');
});
```

### 3. Use Page Objects

❌ **Bad - Directly in test:**
```typescript
it('should login', () => {
  cy.get('#email').type('user@example.com');
  cy.get('#password').type('password');
  cy.get('button[type="submit"]').click();
});
```

✅ **Good - Using Page Object:**
```typescript
it('should login', () => {
  const loginPage = new LoginPage();
  loginPage.visit();
  loginPage.login('user@example.com', 'password');
});
```

### 4. Add Appropriate Tags

Always tag your tests for easy filtering:

```typescript
// Test type tags
@smoke       // Quick verification tests
@regression  // Comprehensive test coverage
@api         // API endpoint tests
@e2e         // End-to-end user flows
@integration // Component integration tests

// Priority tags
@critical    // Must-pass tests
@high        // High priority
@medium      // Medium priority
@low         // Low priority

// Feature tags
@login       // Login feature
@checkout    // Checkout feature
@profile     // User profile
@search      // Search functionality

// Special tags
@wip         // Work in progress
@skip        // Temporarily skip
@flaky       // Known flaky test (fix ASAP)
```

### 5. Handle Test Data Properly

✅ **Use fixtures for static data:**
```typescript
cy.fixture('users.json').then((users) => {
  cy.login(users.testUser.email, users.testUser.password);
});
```

✅ **Generate dynamic data:**
```typescript
import { generateUser } from '../../utils/helpers';

const testUser = generateUser();
cy.getByTestId('email-input').type(testUser.email);
```

✅ **Clean up after tests:**
```typescript
after(() => {
  // Delete created test data
  if (createdUserId) {
    cy.apiRequest('DELETE', `/users/${createdUserId}`);
  }
});
```

## 🏗️ Page Object Model Guidelines

### Creating a New Page Object

```typescript
// cypress/pages/ExamplePage.ts
import { BasePage } from './BasePage';

export class ExamplePage extends BasePage {
  constructor() {
    super('/example-path');
  }

  // Selectors - Use private getters
  private get elementName(): Cypress.Chainable<JQuery<HTMLElement>> {
    return this.getByTestId('element-id');
  }

  // Actions - Public methods that interact with page
  public performAction(): void {
    this.elementName.click();
  }

  // Assertions - Public methods that verify page state
  public verifyPageLoaded(): void {
    this.elementName.should('be.visible');
  }
}
```

### Page Object Best Practices

1. **One page object per page/component**
2. **Keep selectors private**
3. **Expose only necessary actions and assertions**
4. **Return chainable objects when needed**
5. **Use descriptive method names**

## 🧪 Custom Commands

### Creating a New Custom Command

1. **Add type definition** in `cypress/support/commands.ts`:

```typescript
declare global {
  namespace Cypress {
    interface Chainable {
      myCustomCommand(param: string): Chainable<void>;
    }
  }
}
```

2. **Implement the command**:

```typescript
Cypress.Commands.add('myCustomCommand', (param: string) => {
  // Implementation
});
```

3. **Document the command**:

```typescript
/**
 * Custom command description
 * @param param - Parameter description
 * @example cy.myCustomCommand('value')
 */
```

## 📊 API Testing Guidelines

### Structure API Tests

```typescript
import { ApiHelper } from '../../utils/api-helpers';

describe('API Feature Tests', { tags: '@api' }, () => {
  let apiHelper: ApiHelper;
  let testData: any;

  before(() => {
    apiHelper = new ApiHelper();
  });

  it('should handle successful response', () => {
    apiHelper.post('/endpoint', testData).then((response) => {
      // Validate status
      apiHelper.validateStatus(response, 201);
      
      // Validate schema
      apiHelper.validateSchema(response, {
        id: 'number',
        name: 'string',
      });
      
      // Validate response time
      apiHelper.validateResponseTime(response, 2000);
    });
  });

  it('should handle error response', { tags: '@negative' }, () => {
    apiHelper.post('/endpoint', invalidData).then((response) => {
      apiHelper.validateStatus(response, 400);
      expect(response.body).to.have.property('error');
    });
  });
});
```

## 🔄 Pull Request Checklist

Before submitting a PR, ensure:

- [ ] Tests follow naming conventions
- [ ] All tests have appropriate tags
- [ ] Tests use Page Objects where applicable
- [ ] Test data is properly managed (fixtures or generators)
- [ ] Tests include both positive and negative scenarios
- [ ] No hardcoded waits (use Cypress automatic waiting)
- [ ] All tests pass locally
- [ ] No linting errors
- [ ] Test cleanup is implemented
- [ ] Documentation is updated if needed

## 🚫 Common Anti-Patterns to Avoid

### ❌ Don't: Chain too many commands without assertions

```typescript
// Bad
cy.get('.button').click().get('.modal').find('.input').type('text');
```

### ✅ Do: Add intermediate assertions

```typescript
// Good
cy.get('.button').click();
cy.get('.modal').should('be.visible');
cy.get('.modal').find('.input').type('text');
```

### ❌ Don't: Use arbitrary waits

```typescript
// Bad
cy.wait(3000);
```

### ✅ Do: Wait for specific conditions

```typescript
// Good
cy.waitForElement('.loading-spinner', { timeout: 5000 });
cy.get('.data').should('be.visible');
```

### ❌ Don't: Use CSS selectors that can easily break

```typescript
// Bad
cy.get('.btn.btn-primary.submit-btn');
```

### ✅ Do: Use data-testid attributes

```typescript
// Good
cy.getByTestId('submit-button');
```

### ❌ Don't: Have tests depend on each other

```typescript
// Bad - Test 2 depends on Test 1
it('creates user', () => { /* ... */ });
it('updates user', () => { /* assumes user from test 1 */ });
```

### ✅ Do: Make tests independent

```typescript
// Good
it('creates user', () => { /* ... */ });
it('updates user', () => {
  // Create user first
  const user = createTestUser();
  // Then update
});
```

## 🐛 Debugging Tests

### Enable Debug Mode

```typescript
// Add .debug() to pause execution
cy.getByTestId('element').debug();

// Add .pause() to pause test runner
cy.pause();

// Log data
cy.log('Custom debug message');
```

### Use Chrome DevTools

```bash
# Run in headed mode with DevTools
npm run test:headed
```

### Take Screenshots

```typescript
// Manual screenshot
cy.screenshot('debug-screenshot');

// Full page screenshot
cy.fullPageScreenshot('full-page-debug');
```

## 📚 Resources

- [Cypress Best Practices](https://docs.cypress.io/guides/references/best-practices)
- [Testing Library Best Practices](https://testing-library.com/docs/guiding-principles)
- [Test Automation Patterns](https://martinfowler.com/articles/practical-test-pyramid.html)

## 🤝 Getting Help

- Review existing tests for examples
- Check the README.md for documentation
- Ask the QA team in Slack/Teams
- Create an issue for framework improvements

## 🎓 Training Resources

For new team members:

1. Complete Cypress tutorial: https://docs.cypress.io/guides/getting-started/installing-cypress
2. Review example tests in `cypress/e2e/`
3. Read the QUICKSTART.md guide
4. Pair with experienced team member
5. Start with simple smoke tests

---

**Thank you for helping maintain our test automation framework! 🚀**

