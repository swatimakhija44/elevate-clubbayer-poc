import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { MenuService } from './menu.service';
import { environment } from '../../environments/environment.development';
import { of } from 'rxjs';

describe('MenuService', () => {
  let service: MenuService;
  let httpMock: HttpTestingController;

  const mockToken = 'fake-token';
  const mockMenuData = { items: ['Home', 'Settings'] };  // Example mock menu data

  // Set up the test bed
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [MenuService]
    });

    service = TestBed.inject(MenuService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    // Ensure that no outstanding HTTP requests remain after each test
    httpMock.verify();
  });

  it('should fetch a cached token if available and not expired', () => {
    // Mock the token cache
    service['TOKEN_CACHE'].accessToken = mockToken;
    service['TOKEN_CACHE'].expiresAt = Date.now() + 10000;  // Token is valid for 10 seconds

    // Call the method to fetch token
    service.fetchToken().subscribe((token) => {
      expect(token).toBe(mockToken);  // Ensure the cached token is returned
    });

    // No HTTP requests should be made
    httpMock.expectNone(environment.DRUPAL_BASE_URL + '/oauth/token');
  });

  it('should fetch a new token if none is cached or token is expired', () => {
    // Simulate no cached token
    service['TOKEN_CACHE'].accessToken = null;
    service['TOKEN_CACHE'].expiresAt = null;

    // Mock the HTTP POST request to fetch a new token
    const tokenResponse = { access_token: mockToken, expires_in: 3600 }; // 1 hour expiration

    // Make the call to fetch token
    service.fetchToken().subscribe((token) => {
      expect(token).toBe(mockToken);  // Ensure the new token is returned
      expect(service['TOKEN_CACHE'].accessToken).toBe(mockToken);  // Ensure the token is cached
    });

    const req = httpMock.expectOne(environment.DRUPAL_BASE_URL + '/oauth/token');
    expect(req.request.method).toBe('POST');
    req.flush(tokenResponse);  // Return mock token response
  });

  it('should throw error if fetching token fails', () => {
    // Simulate HTTP error response
    service['TOKEN_CACHE'].accessToken = null;
    service['TOKEN_CACHE'].expiresAt = null;

    service.fetchToken().subscribe({
      next: () => fail('Expected error, but got token'),
      error: (error) => {
        expect(error.message).toBe('Failed to fetch access token');  // Check error message
      }
    });

    const req = httpMock.expectOne(environment.DRUPAL_BASE_URL + '/oauth/token');
    req.flush('Token fetch error', { status: 500, statusText: 'Server Error' });
  });

  it('should fetch the menu data with valid token', () => {
    // Mock the token response
    service['TOKEN_CACHE'].accessToken = mockToken;
    service['TOKEN_CACHE'].expiresAt = Date.now() + 10000;  // Token is valid for 10 seconds

    // Mock the menu data
    service.getMenu(mockToken).subscribe((menu) => {
      expect(menu).toEqual(mockMenuData);  // Ensure the menu data is returned correctly
    });

    const req = httpMock.expectOne(environment.DRUPAL_BASE_URL + '/api/menu_items/bayph-radlgy-main-menu');
    expect(req.request.method).toBe('GET');
    req.flush(mockMenuData);  // Return mock menu data
  });

  it('should throw error if menu fetching fails', () => {
    // Simulate menu fetch error
    service['TOKEN_CACHE'].accessToken = mockToken;
    service['TOKEN_CACHE'].expiresAt = Date.now() + 10000;  // Token is valid for 10 seconds

    service.getMenu(mockToken).subscribe({
      next: () => fail('Expected error, but got menu'),
      error: (error) => {
        expect(error.status).toBe(500);  // Check error status code
        expect(error.statusText).toBe('Server Error');  // Check error message
      }
    });

    const req = httpMock.expectOne(environment.DRUPAL_BASE_URL + '/api/menu_items/bayph-radlgy-main-menu');
    req.flush('Menu fetch error', { status: 500, statusText: 'Server Error' });
  });
});
