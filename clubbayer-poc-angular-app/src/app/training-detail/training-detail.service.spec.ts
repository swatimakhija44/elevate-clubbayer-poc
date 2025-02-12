import { TestBed } from '@angular/core/testing';
import { TrainingDetailService } from './training-detail.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { HttpHeaders } from '@angular/common/http';

describe('TrainingDetailService', () => {
  let service: TrainingDetailService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule], // Import HttpClientTestingModule
      providers: [TrainingDetailService] // Make sure the service is provided here
    });

    service = TestBed.inject(TrainingDetailService); // Inject the service
    httpMock = TestBed.inject(HttpTestingController); // Inject the HTTP testing controller
  });

  afterEach(() => {
    // Ensure there are no outstanding requests after each test
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

    // Expect the fetchToken method to have been called
    expect(service.fetchToken).toHaveBeenCalled();

    // Mock the HTTP request and simulate an error
    const req = httpMock.expectOne(`${service.fileUrl}/${id}/field_media_image`);
    req.flush('Error', { status: 500, statusText: 'Internal Server Error' });
  });
});
