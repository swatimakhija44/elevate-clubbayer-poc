import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TrainingDetailService } from './training-detail.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { TrainingDetailComponent } from './training-detail.component';
import { ActivatedRoute } from '@angular/router';
import { environment } from '../../environments/environments';

describe('TrainingDetailService', () => {
  let service: TrainingDetailService;
  let httpMock: HttpTestingController;
  let component: TrainingDetailComponent;
  let fixture: ComponentFixture<TrainingDetailComponent>;
  let activatedRouteMock: jasmine.SpyObj<ActivatedRoute>;
  const mockToken = 'valid-token';
  beforeEach(() => {
    activatedRouteMock = jasmine.createSpyObj('ActivatedRoute', ['snapshot']);

    // Mock ActivatedRoute to return the trainingId from the route
    activatedRouteMock.snapshot = { paramMap: { get: jasmine.createSpy().and.returnValue('1') } } as any;
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule], // Import HttpClientTestingModule
      providers: [TrainingDetailService, { provide: ActivatedRoute, useValue: activatedRouteMock }] // Make sure the service is provided here
    });
    fixture = TestBed.createComponent(TrainingDetailComponent);
    component = fixture.componentInstance;
    service = TestBed.inject(TrainingDetailService); // Inject the service
    httpMock = TestBed.inject(HttpTestingController); // Inject the HTTP testing controller
  });

  afterEach(() => {
    // Ensure there are no outstanding requests after each test
    httpMock.verify();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should return cached token if available and valid', () => {
    service['TOKEN_CACHE'] = { accessToken: mockToken, expiresAt: Date.now() + 10000 };

    service.fetchToken().subscribe((token) => {
      expect(token).toBe(mockToken);
    });
  });


  it('should fetch a new token if not cached or expired', () => {

    service['TOKEN_CACHE'] = { accessToken: null, expiresAt: null };


    const mockToken = '123';
    const mockTokenResponse = { access_token: mockToken, expires_in: 3600 };

    service.fetchToken().subscribe((token) => {
      expect(token).toBe(mockToken);
    });
    const expectedUrl = `${environment.DRUPAL_BASE_URL}/oauth/token`;
    const req = httpMock.expectOne(expectedUrl);

    expect(req.request.method).toBe('POST');

    req.flush(mockTokenResponse);
    httpMock.verify();
  });

  it('should handle error from getTraining', () => {

    const trainingId = '12345';
    const mockError = 'Failed to fetch training data';  // The expected error message

    // Mock the fetchToken method to return the mock token
    spyOn(service, 'fetchToken').and.returnValue(of(mockToken));

    // Call the getTraining method
    service.getTraining(trainingId).subscribe({
      next: () => fail('expected an error, not training data'),
      error: (error: HttpErrorResponse) => {
        // Check if the error object is an instance of HttpErrorResponse
        expect(error instanceof HttpErrorResponse).toBeTrue();

        // Check if the error message is correct (you can access the `error` property of HttpErrorResponse)
        expect(error.error).toBe(mockError); // The error message returned by the server
        expect(error.status).toBe(500);  // Check if the status is 500
        expect(error.statusText).toBe('Server Error');  // Check if the status text is 'Server Error'
        expect(error.url).toBe(`${service.trainUrl}/${trainingId}?_format=json`); // Check if the URL is correct
      }
    });

    // Expect that the HTTP request was made
    const req = httpMock.expectOne(`${service.trainUrl}/${trainingId}?_format=json`);

    expect(req.request.method).toBe('GET');  // The request method should be GET

    // Simulate an error response from the server
    req.flush(mockError, { status: 500, statusText: 'Server Error' });

    // Ensure there are no outstanding HTTP requests
    httpMock.verify();
  });


  it('should call fetchToken and then http.get when calling getImageUrl', () => {
    const mockImageData = { url: 'http://example.com/image.jpg' }; // Mock image data
    const id = 123;

    // Mock the fetchToken to return a valid token
    spyOn(service, 'fetchToken').and.returnValue(of('mockToken'));

    // Call the service method
    service.getImageUrl(id).subscribe(response => {
      expect(response).toEqual(mockImageData);
    });

    // Expect the fetchToken method to have been called
    expect(service.fetchToken).toHaveBeenCalled();

    // Expect the HTTP request to have been made with the correct headers
    const req = httpMock.expectOne((request) =>
      request.url === `${service.fileUrl}/${id}/field_media_image` &&
      request.headers.has('Authorization') &&
      request.headers.get('Authorization') === 'Bearer mockToken' &&
      request.headers.get('X-Skip-Interceptor') === 'true' // Check for the custom header
    );

    expect(req.request.method).toBe('GET');
    req.flush(mockImageData); // Return mock image data as the HTTP response
  });

  it('should handle errors when http.get fails in getImageUrl', () => {
    const id = 123;

    // Mock the fetchToken to return a valid token
    spyOn(service, 'fetchToken').and.returnValue(of('mockToken'));

    // Call the service method
    service.getImageUrl(id).subscribe(
      () => fail('Expected an error, but got success'),
      (error) => {
        expect(error.status).toBe(500); // Example of handling an HTTP error
        expect(error.statusText).toBe('Internal Server Error');
      }
    );



    // Mock the HTTP request and simulate an error
    const req = httpMock.expectOne(`${service.fileUrl}/${id}/field_media_image`);
    req.flush('Error', { status: 500, statusText: 'Internal Server Error' });
  });

  it('should get training details using the access token', () => {
    const mockToken = 'valid-token';
    const mockTrainingResponse = { id: 1, name: 'Training 1' };  // Example response
    const trainingId = '12345';

    // Mock fetchToken() to return a predefined token
    spyOn(service, 'fetchToken').and.returnValue(of(mockToken));

    // Call getTraining
    service.getTraining(trainingId).subscribe(response => {
      expect(response).toEqual(mockTrainingResponse);
    });

    // Expect the HTTP GET request to have been made with the correct URL and headers
    const req = httpMock.expectOne(`${service.trainUrl}/${trainingId}?_format=json`);

    // Check that the request method is GET
    expect(req.request.method).toBe('GET');

    // Check that the Authorization header is set correctly with the token
    expect(req.request.headers.has('Authorization')).toBeTrue();
    expect(req.request.headers.get('Authorization')).toBe(`Bearer ${mockToken}`);

    // Simulate a successful response
    req.flush(mockTrainingResponse);
  });


});
