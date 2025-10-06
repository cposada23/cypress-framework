/**
 * API testing helper functions
 */

export class ApiHelper {
  private baseUrl: string;
  private token: string | null;

  constructor(baseUrl?: string) {
    this.baseUrl = baseUrl || Cypress.env('apiUrl');
    this.token = null;
  }

  /**
   * Set authentication token
   */
  setToken(token: string): void {
    this.token = token;
  }

  /**
   * Get authentication headers
   */
  private getHeaders(): { [key: string]: string } {
    const headers: { [key: string]: string } = {
      'Content-Type': 'application/json',
    };
    
    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }
    
    return headers;
  }

  /**
   * Make GET request
   */
  get(endpoint: string, queryParams?: any): Cypress.Chainable<Cypress.Response<any>> {
    let url = `${this.baseUrl}${endpoint}`;
    
    if (queryParams) {
      const params = new URLSearchParams(queryParams).toString();
      url += `?${params}`;
    }
    
    return cy.request({
      method: 'GET',
      url,
      headers: this.getHeaders(),
      failOnStatusCode: false,
    });
  }

  /**
   * Make POST request
   */
  post(endpoint: string, body: any): Cypress.Chainable<Cypress.Response<any>> {
    return cy.request({
      method: 'POST',
      url: `${this.baseUrl}${endpoint}`,
      body,
      headers: this.getHeaders(),
      failOnStatusCode: false,
    });
  }

  /**
   * Make PUT request
   */
  put(endpoint: string, body: any): Cypress.Chainable<Cypress.Response<any>> {
    return cy.request({
      method: 'PUT',
      url: `${this.baseUrl}${endpoint}`,
      body,
      headers: this.getHeaders(),
      failOnStatusCode: false,
    });
  }

  /**
   * Make PATCH request
   */
  patch(endpoint: string, body: any): Cypress.Chainable<Cypress.Response<any>> {
    return cy.request({
      method: 'PATCH',
      url: `${this.baseUrl}${endpoint}`,
      body,
      headers: this.getHeaders(),
      failOnStatusCode: false,
    });
  }

  /**
   * Make DELETE request
   */
  delete(endpoint: string): Cypress.Chainable<Cypress.Response<any>> {
    return cy.request({
      method: 'DELETE',
      url: `${this.baseUrl}${endpoint}`,
      headers: this.getHeaders(),
      failOnStatusCode: false,
    });
  }

  /**
   * Validate response status
   */
  validateStatus(response: Cypress.Response<any>, expectedStatus: number): void {
    expect(response.status).to.eq(expectedStatus);
  }

  /**
   * Validate response body contains
   */
  validateBodyContains(response: Cypress.Response<any>, key: string, value?: any): void {
    expect(response.body).to.have.property(key);
    if (value !== undefined) {
      expect(response.body[key]).to.eq(value);
    }
  }

  /**
   * Validate response schema
   */
  validateSchema(response: Cypress.Response<any>, schema: any): void {
    const body = response.body;
    Object.keys(schema).forEach((key) => {
      expect(body).to.have.property(key);
      if (schema[key] !== null) {
        expect(typeof body[key]).to.eq(schema[key]);
      }
    });
  }

  /**
   * Validate response time
   */
  validateResponseTime(response: Cypress.Response<any>, maxTime: number): void {
    expect(response.duration).to.be.lessThan(maxTime);
  }
}

