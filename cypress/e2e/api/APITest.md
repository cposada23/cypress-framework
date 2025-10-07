# API Testing Guide

This guide explains how to write effective API tests using the Cypress Test Automation Framework.

## 📋 Table of Contents

- [Overview](#overview)
- [Getting Started](#getting-started)
- [Using ApiHelper Class](#using-apihelper-class)
- [Writing API Tests](#writing-api-tests)
- [Common Patterns](#common-patterns)
- [Validation Methods](#validation-methods)
- [Best Practices](#best-practices)
- [Examples](#examples)

## 🎯 Overview

API tests in this framework use Cypress's built-in `cy.request()` command along with our custom `ApiHelper` utility class for streamlined testing. API tests are tagged with `@api` for easy filtering.

## 🚀 Getting Started

### Basic Test Structure

```typescript
import { ApiHelper } from '../../utils/api-helpers';

describe('API Feature Tests', { tags: '@api' }, () => {
  let apiHelper: ApiHelper;

  before(() => {
    apiHelper = new ApiHelper();
  });

  it('should perform API operation', () => {
    // Test implementation
  });
});
```

### Running API Tests

```bash
# Run all API tests
npm run test:api

# Run specific API test file
npx cypress run --spec "cypress/e2e/api/users.cy.ts"

# Run API tests in specific environment
npm run test:qa -- --env grepTags=@api
```

## 🛠️ Using ApiHelper Class

### Initialize ApiHelper

```typescript
import { ApiHelper } from '../../utils/api-helpers';

const apiHelper = new ApiHelper();
// Uses default API URL from Cypress.env('apiUrl')

// Or with custom base URL
const apiHelper = new ApiHelper('https://custom-api.com');
```

### Set Authentication Token

```typescript
// Set token for authenticated requests
apiHelper.setToken('your-auth-token-here');
```

### HTTP Methods

#### GET Request

```typescript
// Simple GET
apiHelper.get('/users').then((response) => {
  expect(response.status).to.eq(200);
});

// GET with query parameters
apiHelper.get('/users', { role: 'admin', active: true }).then((response) => {
  expect(response.body).to.be.an('array');
});
```

#### POST Request

```typescript
const userData = {
  name: 'John Doe',
  email: 'john@example.com',
  role: 'user'
};

apiHelper.post('/users', userData).then((response) => {
  expect(response.status).to.eq(201);
  expect(response.body).to.have.property('id');
});
```

#### PUT Request

```typescript
const updateData = {
  name: 'Jane Doe',
  email: 'jane@example.com'
};

apiHelper.put('/users/123', updateData).then((response) => {
  expect(response.status).to.eq(200);
});
```

#### PATCH Request

```typescript
const partialUpdate = {
  name: 'Updated Name'
};

apiHelper.patch('/users/123', partialUpdate).then((response) => {
  expect(response.status).to.eq(200);
});
```

#### DELETE Request

```typescript
apiHelper.delete('/users/123').then((response) => {
  expect(response.status).to.eq(204);
});
```

## ✍️ Writing API Tests

### Complete CRUD Example

```typescript
import { ApiHelper } from '../../utils/api-helpers';
import { generateUser } from '../../utils/helpers';

describe('User CRUD API Tests', { tags: ['@api', '@users'] }, () => {
  let apiHelper: ApiHelper;
  let createdUserId: string;
  let testUser: any;

  before(() => {
    apiHelper = new ApiHelper();
    testUser = generateUser();
  });

  it('should create a new user (POST)', { tags: '@post' }, () => {
    apiHelper.post('/users', testUser).then((response) => {
      // Validate status
      apiHelper.validateStatus(response, 201);
      
      // Validate response has ID
      apiHelper.validateBodyContains(response, 'id');
      
      // Store ID for other tests
      createdUserId = response.body.id;
      
      // Validate specific fields
      expect(response.body.email).to.eq(testUser.email);
      expect(response.body.name).to.eq(testUser.name);
    });
  });

  it('should retrieve user by ID (GET)', { tags: '@get' }, () => {
    apiHelper.get(`/users/${createdUserId}`).then((response) => {
      apiHelper.validateStatus(response, 200);
      apiHelper.validateBodyContains(response, 'id', createdUserId);
      apiHelper.validateBodyContains(response, 'email');
    });
  });

  it('should update user (PUT)', { tags: '@put' }, () => {
    const updateData = {
      ...testUser,
      name: 'Updated Name'
    };

    apiHelper.put(`/users/${createdUserId}`, updateData).then((response) => {
      apiHelper.validateStatus(response, 200);
      expect(response.body.name).to.eq('Updated Name');
    });
  });

  it('should partially update user (PATCH)', { tags: '@patch' }, () => {
    apiHelper.patch(`/users/${createdUserId}`, { status: 'active' }).then((response) => {
      apiHelper.validateStatus(response, 200);
      expect(response.body.status).to.eq('active');
    });
  });

  it('should delete user (DELETE)', { tags: '@delete' }, () => {
    apiHelper.delete(`/users/${createdUserId}`).then((response) => {
      apiHelper.validateStatus(response, 204);
    });
  });

  after(() => {
    // Cleanup if needed
    if (createdUserId) {
      apiHelper.delete(`/users/${createdUserId}`);
    }
  });
});
```

## 🎨 Common Patterns

### 1. Authentication Flow

```typescript
describe('Authentication API', { tags: '@api' }, () => {
  let apiHelper: ApiHelper;
  let authToken: string;

  before(() => {
    apiHelper = new ApiHelper();
  });

  it('should login and receive token', () => {
    const credentials = {
      email: 'user@example.com',
      password: 'password123'
    };

    apiHelper.post('/auth/login', credentials).then((response) => {
      apiHelper.validateStatus(response, 200);
      apiHelper.validateBodyContains(response, 'token');
      
      // Store token for subsequent requests
      authToken = response.body.token;
      apiHelper.setToken(authToken);
    });
  });

  it('should access protected endpoint with token', () => {
    apiHelper.get('/users/me').then((response) => {
      apiHelper.validateStatus(response, 200);
      expect(response.body).to.have.property('email');
    });
  });
});
```

### 2. Error Handling & Negative Tests

```typescript
describe('API Error Handling', { tags: ['@api', '@negative'] }, () => {
  let apiHelper: ApiHelper;

  before(() => {
    apiHelper = new ApiHelper();
  });

  it('should return 404 for non-existent resource', () => {
    apiHelper.get('/users/999999').then((response) => {
      apiHelper.validateStatus(response, 404);
      expect(response.body).to.have.property('error');
      expect(response.body.error).to.include('not found');
    });
  });

  it('should return 400 for invalid data', () => {
    const invalidUser = {
      email: 'invalid-email',  // Invalid email format
      name: ''  // Empty name
    };

    apiHelper.post('/users', invalidUser).then((response) => {
      apiHelper.validateStatus(response, 400);
      expect(response.body).to.have.property('errors');
      expect(response.body.errors).to.be.an('array');
    });
  });

  it('should return 401 for unauthorized access', () => {
    apiHelper.setToken('invalid-token');
    apiHelper.get('/users/me').then((response) => {
      apiHelper.validateStatus(response, 401);
    });
  });

  it('should return 403 for forbidden access', () => {
    // Assuming user doesn't have admin privileges
    apiHelper.delete('/admin/settings').then((response) => {
      apiHelper.validateStatus(response, 403);
    });
  });
});
```

### 3. Schema Validation

```typescript
it('should return user with correct schema', () => {
  apiHelper.get('/users/1').then((response) => {
    apiHelper.validateStatus(response, 200);
    
    // Validate response schema
    apiHelper.validateSchema(response, {
      id: 'number',
      email: 'string',
      name: 'string',
      createdAt: 'string',
      updatedAt: 'string'
    });
  });
});
```

### 4. Response Time Testing

```typescript
it('should respond within acceptable time', () => {
  apiHelper.get('/users').then((response) => {
    apiHelper.validateStatus(response, 200);
    
    // Ensure response time is under 2 seconds
    apiHelper.validateResponseTime(response, 2000);
  });
});
```

### 5. Pagination Testing

```typescript
it('should handle pagination', () => {
  const params = {
    page: 1,
    limit: 10
  };

  apiHelper.get('/users', params).then((response) => {
    apiHelper.validateStatus(response, 200);
    
    expect(response.body).to.have.property('data');
    expect(response.body).to.have.property('pagination');
    expect(response.body.data).to.have.length.at.most(10);
    expect(response.body.pagination).to.have.property('currentPage', 1);
  });
});
```

### 6. Using Cypress Native Request

If you need more control, use Cypress's native `cy.request()`:

```typescript
it('should handle custom headers', () => {
  cy.request({
    method: 'GET',
    url: `${Cypress.env('apiUrl')}/users`,
    headers: {
      'Content-Type': 'application/json',
      'Custom-Header': 'custom-value',
      'Authorization': 'Bearer token'
    },
    failOnStatusCode: false
  }).then((response) => {
    expect(response.status).to.eq(200);
  });
});
```

## ✅ Validation Methods

### validateStatus()
```typescript
apiHelper.validateStatus(response, 200);
```
Validates the HTTP status code.

### validateBodyContains()
```typescript
// Check if property exists
apiHelper.validateBodyContains(response, 'id');

// Check property with specific value
apiHelper.validateBodyContains(response, 'email', 'user@example.com');
```
Validates that response body contains a specific property and optionally checks its value.

### validateSchema()
```typescript
apiHelper.validateSchema(response, {
  id: 'number',
  name: 'string',
  active: 'boolean',
  metadata: 'object'
});
```
Validates that response body matches the expected schema.

### validateResponseTime()
```typescript
apiHelper.validateResponseTime(response, 3000);
```
Validates that response time is less than specified milliseconds.

## 📚 Best Practices

### 1. Use Descriptive Test Names
```typescript
✅ it('should create user with valid data and return 201')
❌ it('test user creation')
```

### 2. Tag Your Tests Appropriately
```typescript
describe('User API', { tags: ['@api', '@users'] }, () => {
  it('creates user', { tags: '@post' })
  it('handles errors', { tags: '@negative' })
});
```

### 3. Clean Up Test Data
```typescript
after(() => {
  // Always clean up created resources
  if (createdUserId) {
    apiHelper.delete(`/users/${createdUserId}`);
  }
});
```

### 4. Use Test Data Generators
```typescript
import { generateUser, generateProduct } from '../../utils/helpers';

const testUser = generateUser();  // Creates realistic test data
```

### 5. Test Both Success and Failure Scenarios
```typescript
// Positive test
it('should create user successfully', { tags: '@positive' })

// Negative tests
it('should reject invalid email', { tags: '@negative' })
it('should reject duplicate email', { tags: '@negative' })
```

### 6. Validate Multiple Aspects
```typescript
apiHelper.post('/users', userData).then((response) => {
  // Status code
  apiHelper.validateStatus(response, 201);
  
  // Schema
  apiHelper.validateSchema(response, expectedSchema);
  
  // Response time
  apiHelper.validateResponseTime(response, 2000);
  
  // Specific values
  expect(response.body.email).to.eq(userData.email);
});
```

### 7. Use Fixtures for Complex Data
```typescript
cy.fixture('users.json').then((users) => {
  apiHelper.post('/users', users.adminUser).then((response) => {
    expect(response.status).to.eq(201);
  });
});
```

### 8. Chain Related Tests Logically
```typescript
// Store data between tests when needed
let userId: string;

it('creates user', () => {
  apiHelper.post('/users', data).then((response) => {
    userId = response.body.id;
  });
});

it('retrieves created user', () => {
  apiHelper.get(`/users/${userId}`).then((response) => {
    expect(response.status).to.eq(200);
  });
});
```

## 📖 Examples

See the example API test file: `users.cy.ts` for a complete implementation.

### Quick Reference

```typescript
import { ApiHelper } from '../../utils/api-helpers';
import { generateUser } from '../../utils/helpers';

describe('API Tests', { tags: '@api' }, () => {
  let apiHelper: ApiHelper;

  before(() => {
    apiHelper = new ApiHelper();
  });

  it('GET request', () => {
    apiHelper.get('/endpoint').then((response) => {
      apiHelper.validateStatus(response, 200);
    });
  });

  it('POST request', () => {
    const data = generateUser();
    apiHelper.post('/endpoint', data).then((response) => {
      apiHelper.validateStatus(response, 201);
    });
  });

  it('PUT request', () => {
    apiHelper.put('/endpoint/1', data).then((response) => {
      apiHelper.validateStatus(response, 200);
    });
  });

  it('DELETE request', () => {
    apiHelper.delete('/endpoint/1').then((response) => {
      apiHelper.validateStatus(response, 204);
    });
  });
});
```

## 🔗 Additional Resources

- [Cypress Network Requests Documentation](https://docs.cypress.io/guides/guides/network-requests)
- [API Testing Best Practices](https://www.ministryoftesting.com/dojo/lessons/api-testing-best-practices)
- Main Framework [README.md](../../../README.md)

---

**Happy API Testing! 🚀**

