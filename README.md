# Cypress Test Automation Framework

A comprehensive, scalable test automation framework built with Cypress and TypeScript. This framework supports multiple testing methodologies including E2E, API, Integration, Smoke, and Regression testing across various environments.

## 📋 Table of Contents

- [Features](#features)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running Tests](#running-tests)
- [Writing Tests](#writing-tests)
- [Page Object Model](#page-object-model)
- [Custom Commands](#custom-commands)
- [Test Data Management](#test-data-management)
- [Reporting](#reporting)
- [CI/CD Integration](#cicd-integration)
- [Best Practices](#best-practices)

## ✨ Features

- **TypeScript Support**: Fully typed test code with IntelliSense support
- **Multi-Environment Configuration**: Seamlessly run tests across Local, Dev, QA, Staging, and Production
- **Multiple Test Types**: Organized structure for E2E, API, Integration, Smoke, and Regression tests
- **Tag-Based Test Filtering**: Run specific test suites using tags with `@cypress/grep`
- **Page Object Model**: Scalable POM pattern for maintainable test code
- **Custom Commands**: Extended Cypress commands for common operations
- **Data Generation**: Built-in test data generation using Faker.js
- **Comprehensive Reporting**: HTML reports with screenshots and videos
- **API Testing Utilities**: Helper class for streamlined API testing
- **Session Management**: Efficient login/authentication handling
- **Parallel Execution**: Support for parallel test execution in CI/CD

## 📁 Project Structure

```
cypressFramework/
├── cypress/
│   ├── e2e/
│   │   ├── api/              # API tests
│   │   ├── integration/      # Integration tests
│   │   ├── regression/       # Regression test suites
│   │   └── smoke/            # Smoke tests
│   ├── fixtures/             # Test data files
│   ├── pages/                # Page Object Models
│   ├── support/
│   │   ├── commands.ts       # Custom Cypress commands
│   │   └── e2e.ts           # Global configuration and hooks
│   ├── utils/
│   │   ├── api-helpers.ts   # API testing utilities
│   │   └── helpers.ts       # General helper functions
│   └── config/              # Environment-specific configurations
│       ├── local.config.ts
│       ├── dev.config.ts
│       ├── qa.config.ts
│       ├── staging.config.ts
│       └── production.config.ts
├── cypress.config.ts         # Main Cypress configuration
├── tsconfig.json            # TypeScript configuration
├── package.json             # Dependencies and scripts
└── README.md               # This file
```

## 🔧 Prerequisites

- **Node.js**: Version 18.x or higher
- **npm**: Version 9.x or higher (comes with Node.js)
- **Git**: For version control

## 📦 Installation

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd cypressFramework
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Verify installation**:
   ```bash
   npx cypress verify
   ```

## ⚙️ Configuration

### Environment Configuration

Each environment has its own configuration file in `cypress/config/`:

- `local.config.ts` - Local development
- `dev.config.ts` - Development environment
- `qa.config.ts` - QA environment
- `staging.config.ts` - Staging environment
- `production.config.ts` - Production environment

**Example configuration structure**:

```typescript
export default {
  baseUrl: 'https://your-app-url.com',
  env: {
    apiUrl: 'https://your-api-url.com/api',
    environment: 'qa',
    username: process.env.QA_USERNAME || 'default@example.com',
    password: process.env.QA_PASSWORD || 'defaultPassword',
  },
};
```

### Environment Variables

Create a `.env` file in the root directory (use `.env.example` as template):

```env
CYPRESS_ENVIRONMENT=local
DEV_USERNAME=your-dev-username
DEV_PASSWORD=your-dev-password
QA_USERNAME=your-qa-username
QA_PASSWORD=your-qa-password
```

## 🚀 Running Tests

### Basic Commands

```bash
# Open Cypress Test Runner (interactive mode)
npm run cy:open

# Run all tests headlessly
npm test

# Run tests in headed mode
npm run test:headed
```

### Environment-Specific Tests

```bash
# Run tests in specific environment
npm run test:local      # Local environment
npm run test:dev        # Dev environment
npm run test:qa         # QA environment
npm run test:staging    # Staging environment
npm run test:production # Production environment (use with caution)
```

### Tag-Based Test Execution

```bash
# Run tests by type
npm run test:smoke      # Run smoke tests only
npm run test:regression # Run regression tests
npm run test:api        # Run API tests only
npm run test:e2e        # Run E2E tests only
npm run test:integration # Run integration tests
npm run test:critical   # Run critical path tests
```

### Browser-Specific Tests

```bash
npm run test:chrome   # Run in Chrome
npm run test:firefox  # Run in Firefox
npm run test:edge     # Run in Edge
```

### Advanced Usage

```bash
# Run specific test file
npx cypress run --spec "cypress/e2e/smoke/login.cy.ts"

# Run with specific browser
npx cypress run --browser chrome

# Run with custom environment
npx cypress run --env environment=qa

# Combine multiple tags
npx cypress run --env grepTags="@smoke+@critical"

# Exclude specific tags
npx cypress run --env grepTags="@smoke -@skip"
```

## ✍️ Writing Tests

### Test Structure with Tags

```typescript
/**
 * Login Tests
 * @tags @smoke @login @critical
 */
describe('Login Functionality', { tags: ['@smoke', '@login'] }, () => {
  beforeEach(() => {
    cy.visit('/login');
  });

  it('should login successfully', { tags: '@critical' }, () => {
    cy.getByTestId('email-input').type(Cypress.env('username'));
    cy.getByTestId('password-input').type(Cypress.env('password'));
    cy.getByTestId('login-button').click();
    cy.url().should('include', '/dashboard');
  });
});
```

### API Testing Example

```typescript
import { ApiHelper } from '../../utils/api-helpers';

describe('API Tests', { tags: '@api' }, () => {
  let apiHelper: ApiHelper;

  before(() => {
    apiHelper = new ApiHelper();
  });

  it('should create a new user', () => {
    const userData = {
      name: 'John Doe',
      email: 'john@example.com',
    };

    apiHelper.post('/users', userData).then((response) => {
      apiHelper.validateStatus(response, 201);
      apiHelper.validateBodyContains(response, 'id');
    });
  });
});
```

## 🎭 Page Object Model

### Creating a Page Object

```typescript
// cypress/pages/LoginPage.ts
import { BasePage } from './BasePage';

export class LoginPage extends BasePage {
  constructor() {
    super('/login');
  }

  // Locators
  private get emailInput() {
    return this.getByTestId('email-input');
  }

  private get passwordInput() {
    return this.getByTestId('password-input');
  }

  private get loginButton() {
    return this.getByTestId('login-button');
  }

  // Actions
  login(email: string, password: string): void {
    this.emailInput.type(email);
    this.passwordInput.type(password);
    this.loginButton.click();
  }

  verifyLoginPage(): void {
    this.waitForVisible('[data-testid="email-input"]');
    this.getTitle().should('include', 'Login');
  }
}
```

### Using Page Objects in Tests

```typescript
import { LoginPage } from '../../pages/LoginPage';

describe('Login Tests', () => {
  const loginPage = new LoginPage();

  it('should login successfully', () => {
    loginPage.visit();
    loginPage.verifyLoginPage();
    loginPage.login('user@example.com', 'password123');
    cy.url().should('include', '/dashboard');
  });
});
```

## 🔨 Custom Commands

The framework includes several custom commands:

```typescript
// Login with session caching
cy.login('username', 'password');

// API request with authentication
cy.apiRequest('POST', '/api/endpoint', { data: 'value' });

// Wait for element to be ready
cy.waitForElement('.submit-button');

// Check if element exists (non-failing)
cy.elementExists('.optional-element').then((exists) => {
  if (exists) {
    // Do something
  }
});

// Generate test data
cy.generateTestData('user').then((user) => {
  // Use generated user data
});

// Full page screenshot
cy.fullPageScreenshot('screenshot-name');
```

## 📊 Test Data Management

### Using Fixtures

```typescript
// Load fixture data
cy.fixture('users.json').then((users) => {
  cy.login(users[0].email, users[0].password);
});
```

### Generating Test Data

```typescript
import { generateUser, generateProduct } from '../../utils/helpers';

const user = generateUser();
const product = generateProduct();

// Use in tests
cy.getByTestId('name-input').type(user.firstName);
```

## 📈 Reporting

### View Reports

Reports are generated automatically after test execution:

```bash
# Reports are saved to: cypress/reports/
# View HTML report: cypress/reports/html/index.html
```

### Generate Reports Manually

```bash
npm run report:merge     # Merge all JSON reports
npm run report:generate  # Generate HTML report
```

### Clean Reports

```bash
npm run clean  # Remove reports, screenshots, and videos
```

## 🔄 CI/CD Integration

### TODO


## ✅ Best Practices

### 1. Test Organization
- Group related tests in describe blocks
- Use meaningful test descriptions
- Keep tests independent and isolated
- Use appropriate tags for filtering

### 2. Selectors
- Prefer `data-testid` attributes over CSS selectors
- Avoid using text content for critical elements
- Use custom commands for common selector patterns

### 3. Assertions
- Be specific with assertions
- Verify both positive and negative scenarios
- Check multiple conditions when appropriate

### 4. Test Data
- Use fixtures for static data
- Generate dynamic data using helpers
- Clean up test data after tests

### 5. Waits and Timeouts
- Use Cypress automatic waiting when possible
- Add explicit waits only when necessary
- Configure appropriate timeout values

### 6. Page Objects
- Keep page objects DRY (Don't Repeat Yourself)
- Encapsulate page-specific logic
- Return chainable Cypress objects when needed

### 7. API Testing
- Validate response status codes
- Check response schemas
- Verify response times
- Test error scenarios

### 8. Debugging
- Use `.debug()` command for troubleshooting
- Enable video recording for failed tests
- Take screenshots at critical points
- Use Chrome DevTools during development

### 9. Maintenance
- Review and update tests regularly
- Remove or fix flaky tests promptly
- Keep dependencies up to date
- Document complex test scenarios

### 10. CI/CD
- Run smoke tests on every commit
- Run full regression suite nightly
- Fail the build on test failures
- Archive test reports and artifacts

## 📚 Additional Resources

- [Cypress Documentation](https://docs.cypress.io/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Cypress Best Practices](https://docs.cypress.io/guides/references/best-practices)
- [Testing Library](https://testing-library.com/)

## 🤝 Contributing

1. Create a feature branch
2. Write tests following the established patterns
3. Ensure all tests pass
4. Submit a pull request with a clear description


## 🐛 Troubleshooting

### Common Issues

**Issue**: Cypress binary not found
```bash
# Solution: Verify and install Cypress
npx cypress verify
npx cypress install
```

**Issue**: TypeScript errors
```bash
# Solution: Clean and rebuild
rm -rf node_modules package-lock.json
npm install
```

**Issue**: Tests timing out
- Increase timeout values in `cypress.config.ts`
- Check network connectivity
- Verify application is running

**Issue**: Element not found
- Ensure correct selectors are used
- Add appropriate waits
- Check if element is in shadow DOM

---

**Happy Testing! 🚀**

