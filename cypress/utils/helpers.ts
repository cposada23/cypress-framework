import { faker } from '@faker-js/faker';

/**
 * Utility helper functions for tests
 */

/**
 * Generate random email
 */
export const generateEmail = (): string => {
  return faker.internet.email();
};

/**
 * Generate random password
 */
export const generatePassword = (length: number = 12): string => {
  return faker.internet.password(length);
};

/**
 * Generate random user data
 */
export const generateUser = () => {
  return {
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    email: faker.internet.email(),
    password: faker.internet.password(12),
    phone: faker.phone.number(),
    address: {
      street: faker.location.streetAddress(),
      city: faker.location.city(),
      state: faker.location.state(),
      zipCode: faker.location.zipCode(),
      country: faker.location.country(),
    },
  };
};

/**
 * Generate random company data
 */
export const generateCompany = () => {
  return {
    name: faker.company.name(),
    catchPhrase: faker.company.catchPhrase(),
    email: faker.internet.email(),
    phone: faker.phone.number(),
  };
};

/**
 * Generate random product data
 */
export const generateProduct = () => {
  return {
    name: faker.commerce.productName(),
    description: faker.commerce.productDescription(),
    price: faker.commerce.price(),
    category: faker.commerce.department(),
    sku: faker.string.alphanumeric(8).toUpperCase(),
  };
};

/**
 * Wait for specified milliseconds
 */
export const wait = (ms: number): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

/**
 * Format date to ISO string
 */
export const formatDate = (date: Date = new Date()): string => {
  return date.toISOString();
};

/**
 * Generate random string
 */
export const randomString = (length: number = 10): string => {
  return faker.string.alphanumeric(length);
};

/**
 * Generate random number
 */
export const randomNumber = (min: number = 1, max: number = 100): number => {
  return faker.number.int({ min, max });
};

/**
 * Retry function with exponential backoff
 */
export const retryWithBackoff = async (
  fn: () => Promise<any>,
  maxRetries: number = 3,
  delay: number = 1000
): Promise<any> => {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      await wait(delay * Math.pow(2, i));
    }
  }
};

/**
 * Deep clone object
 */
export const deepClone = <T>(obj: T): T => {
  return JSON.parse(JSON.stringify(obj));
};

/**
 * Check if object is empty
 */
export const isEmpty = (obj: any): boolean => {
  return Object.keys(obj).length === 0;
};

