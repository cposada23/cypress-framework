/**
 * User API Tests
 * @tags @api @users
 */

import { ApiHelper } from '../../utils/api-helpers';
import { generateUser } from '../../utils/helpers';

describe('User API Tests', { tags: ['@api', '@users'] }, () => {
  let apiHelper: ApiHelper;
  let createdUserId: string;

  before(() => {
    apiHelper = new ApiHelper();
  });

  it('should get all users', { tags: '@get' }, () => {
    apiHelper.get('/users').then((response) => {
      apiHelper.validateStatus(response, 200);
      expect(response.body).to.be.an('array');
      apiHelper.validateResponseTime(response, 2000);
    });
  });

  it('should create a new user', { tags: ['@post', '@smoke'] }, () => {
    const newUser = generateUser();

    apiHelper.post('/users', newUser).then((response) => {
      apiHelper.validateStatus(response, 201);
      apiHelper.validateBodyContains(response, 'id');
      apiHelper.validateBodyContains(response, 'email', newUser.email);
      
      // Store created user ID for cleanup
      createdUserId = response.body.id;
      
      // Validate response time
      apiHelper.validateResponseTime(response, 3000);
    });
  });

  it('should get user by ID', { tags: '@get' }, () => {
    apiHelper.get('/users/1').then((response) => {
      apiHelper.validateStatus(response, 200);
      apiHelper.validateBodyContains(response, 'id');
      apiHelper.validateBodyContains(response, 'email');
      
      // Validate schema
      apiHelper.validateSchema(response, {
        id: 'number',
        email: 'string',
        firstName: 'string',
        lastName: 'string',
      });
    });
  });

  it('should update user', { tags: '@put' }, () => {
    const updateData = {
      firstName: 'Updated',
      lastName: 'Name',
    };

    apiHelper.put('/users/1', updateData).then((response) => {
      apiHelper.validateStatus(response, 200);
      apiHelper.validateBodyContains(response, 'firstName', 'Updated');
    });
  });

  it('should return 404 for non-existent user', { tags: ['@negative', '@get'] }, () => {
    apiHelper.get('/users/999999').then((response) => {
      apiHelper.validateStatus(response, 404);
    });
  });

  it('should validate required fields when creating user', { tags: ['@negative', '@post', '@validation'] }, () => {
    const invalidUser = {
      email: '', // Invalid empty email
    };

    apiHelper.post('/users', invalidUser).then((response) => {
      apiHelper.validateStatus(response, 400);
      expect(response.body).to.have.property('error');
    });
  });

  after(() => {
    // Cleanup: Delete created user
    if (createdUserId) {
      apiHelper.delete(`/users/${createdUserId}`);
    }
  });
});

