# Quick Start Guide

Get up and running with the Cypress Test Automation Framework in minutes!

## 🚀 Quick Setup (5 minutes)

### 1. Install Dependencies
```bash
npm install
```

### 2. Verify Installation
```bash
npx cypress verify
```

### 3. Update Configuration
Edit the environment configuration files in `cypress/config/` to match your application URLs:

```typescript
// cypress/config/local.config.ts
export default {
  baseUrl: 'http://localhost:3000',  // ← Change this to your app URL
  env: {
    apiUrl: 'http://localhost:3000/api',  // ← Change this to your API URL
    environment: 'local',
    username: 'test@example.com',  // ← Your test user credentials
    password: 'TestPassword123!',
  },
};
```

### 4. Run Your First Test
```bash
# Open Cypress Test Runner (recommended for first time)
npm run cy:open

# Or run tests headlessly
npm test
```

## 📝 Creating Your First Test

### Option 1: Quick E2E Test

Create a new file: `cypress/e2e/smoke/my-first-test.cy.ts`

```typescript
describe('My First Test', { tags: '@smoke' }, () => {
  it('visits the homepage', () => {
    cy.visit('/');
    cy.contains('Welcome').should('be.visible');
  });
});
```

### Option 2: Quick API Test

Create a new file: `cypress/e2e/api/my-api-test.cy.ts`

```typescript
import { ApiHelper } from '../../utils/api-helpers';

describe('My API Test', { tags: '@api' }, () => {
  let apiHelper: ApiHelper;

  before(() => {
    apiHelper = new ApiHelper();
  });

  it('should get data from API', () => {
    apiHelper.get('/endpoint').then((response) => {
      apiHelper.validateStatus(response, 200);
      expect(response.body).to.be.an('array');
    });
  });
});
```

### Option 3: Using Page Object Model

1. **Create your page object**: `cypress/pages/HomePage.ts`

```typescript
import { BasePage } from './BasePage';

export class HomePage extends BasePage {
  constructor() {
    super('/');
  }

  private get welcomeMessage() {
    return this.getByTestId('welcome-message');
  }

  verifyHomePage(): void {
    this.welcomeMessage.should('be.visible');
  }
}
```

2. **Use it in your test**:

```typescript
import { HomePage } from '../../pages/HomePage';

describe('Home Page Test', { tags: '@smoke' }, () => {
  const homePage = new HomePage();

  it('should display home page', () => {
    homePage.visit();
    homePage.verifyHomePage();
  });
});
```

## 🎯 Common Commands

```bash
# Run tests by environment
npm run test:local      # Local environment
npm run test:dev        # Dev environment
npm run test:qa         # QA environment

# Run tests by type
npm run test:smoke      # Smoke tests only
npm run test:api        # API tests only
npm run test:e2e        # E2E tests only

# Run specific test file
npx cypress run --spec "cypress/e2e/smoke/my-test.cy.ts"

# Open Cypress UI
npm run cy:open
```

## 🏷️ Using Tags

Add tags to filter and organize your tests:

```typescript
// Multiple tags on describe block
describe('Login Tests', { tags: ['@smoke', '@critical'] }, () => {
  
  // Additional tag on specific test
  it('should login successfully', { tags: '@authentication' }, () => {
    // test code
  });
});
```

Run tests with specific tags:
```bash
npm run test:smoke      # Runs all @smoke tests
npm run test:critical   # Runs all @critical tests

# Custom tag combinations
npx cypress run --env grepTags="@smoke+@critical"  # AND
npx cypress run --env grepTags="@smoke @api"       # OR
npx cypress run --env grepTags="@smoke -@skip"     # Exclude
```

## 🔧 Customizing for Your Application

### 1. Update Selectors in Custom Commands

Edit `cypress/support/commands.ts` to match your app's selectors:

```typescript
Cypress.Commands.add('login', (username: string, password: string) => {
  cy.session([username, password], () => {
    cy.visit('/login');
    cy.get('[data-testid="email-input"]').type(username);  // ← Update these
    cy.get('[data-testid="password-input"]').type(password);
    cy.get('[data-testid="login-button"]').click();
    cy.url().should('not.include', '/login');
  });
});
```

### 2. Add Your Test Data

Create fixtures for your test data:

```json
// cypress/fixtures/my-test-data.json
{
  "validUser": {
    "email": "user@example.com",
    "password": "password123"
  }
}
```

Use in tests:
```typescript
cy.fixture('my-test-data').then((data) => {
  cy.login(data.validUser.email, data.validUser.password);
});
```

### 3. Create Page Objects for Your Pages

Follow the example in `cypress/pages/LoginPage.ts` to create page objects for your application's pages.

## 📊 Viewing Test Reports

After running tests, view the HTML report:

```bash
# Reports are automatically generated in:
# cypress/reports/html/index.html

# Open the report (macOS)
open cypress/reports/html/index.html

# Open the report (Windows)
start cypress/reports/html/index.html

# Open the report (Linux)
xdg-open cypress/reports/html/index.html
```

## 💡 Tips

1. **Start Small**: Begin with a few smoke tests, then expand
2. **Use Test IDs**: Add `data-testid` attributes to your app for reliable selectors
3. **Follow the Examples**: Check out the example tests in `cypress/e2e/`
4. **Use Page Objects**: Keep tests maintainable by using Page Object Model
5. **Tag Everything**: Use tags to organize and filter tests effectively

## 🆘 Need Help?

- Check the full [README.md](README.md) for detailed documentation
- Review example tests in `cypress/e2e/`
- Visit [Cypress Documentation](https://docs.cypress.io/)
- Check the [Troubleshooting section](README.md#troubleshooting) in README

## ✅ Next Steps

Once you're comfortable with the basics:

1. ✅ Write tests for your critical user journeys
2. ✅ Set up CI/CD integration (see `.github/workflows/cypress-tests.yml`)
3. ✅ Add API tests for your backend endpoints
4. ✅ Configure environment-specific test data
5. ✅ Set up test reporting dashboard
6. ✅ Schedule regression tests to run nightly

---

**Happy Testing! 🎉**

