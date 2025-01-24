import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { NewsService } from './news.service';
import { HttpErrorResponse } from '@angular/common/http';
import { of } from 'rxjs';
import { environment } from '../environments/environments';
import { NewsComponent } from './news/news.component';

describe('NewsService', () => {
  let component: NewsComponent;
  let service: NewsService;
  let httpMock: HttpTestingController;

  const mockToken = 'fake-token';
  const mockNewsData = { data: [{ attributes: { title: 'Article 1' } }] };
  const mockImageData = { url: `${environment.DRUPAL_BASE_URL}/file/mime_attachment_binary` };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, NewsComponent],
      providers: [NewsService],
    });
    service = TestBed.inject(NewsService);
    httpMock = TestBed.inject(HttpTestingController);

    component = TestBed.createComponent(NewsComponent).componentInstance;
    service = TestBed.inject(NewsService);
  });

  afterEach(() => {
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


  it('should get news after fetching the token', () => {
    spyOn(service, 'fetchToken').and.returnValue(of(mockToken));

    service.getNews().subscribe((news) => {
      expect(news).toEqual(mockNewsData);
    });

    const expectedUrl = `${environment.DRUPAL_BASE_URL}/jsonapi/node/news`;
    const req = httpMock.expectOne(expectedUrl);
    expect(req.request.method).toBe('GET');
    req.flush(mockNewsData);
  });

  it('should handle error when fetching news fails', () => {
    service.getNews().subscribe({
      next: () => fail('should have failed with an error'),
      error: (error: HttpErrorResponse) => {
        expect(error.status).toBe(500);
        expect(error.error.message).toBe('Internal Server Error');  
      }
    });

    const expectedUrl = `${environment.DRUPAL_BASE_URL}/oauth/token`;
    httpMock.expectOne(expectedUrl);

  });


  it('should fetch image URL after fetching the token', () => {
    const mockImageId = '123';
    spyOn(service, 'fetchToken').and.returnValue(of('fake-token'));
    service.getImageUrl(mockImageId).subscribe((image) => {
      expect(image).toEqual(mockImageData);  
    });

    const expectedUrl = `${environment.DRUPAL_BASE_URL}/jsonapi/file/mime_attachment_binary/${mockImageId}`;

    const req = httpMock.expectOne(expectedUrl);
    expect(req.request.method).toBe('GET');
    req.flush(mockImageData);
    httpMock.verify();
  });


  it('should handle error when fetching image URL fails', () => {
    const mockImageId = '123';
    const mockError = { message: 'Image not found' };
    spyOn(service, 'fetchToken').and.returnValue(of('fake-token'));

    service.getImageUrl(mockImageId).subscribe(
      () => fail('should have failed with an error'),
      (error) => {
        expect(error.status).toBe(404);
        expect(error.error.message).toBe('Image not found');
      }
    );
    const expectedUrl = `${environment.DRUPAL_BASE_URL}/jsonapi/file/mime_attachment_binary/${mockImageId}`;
    const req = httpMock.expectOne(expectedUrl);
    expect(req.request.method).toBe('GET');
    req.flush(mockError, { status: 404, statusText: 'Not Found' });
    httpMock.verify();
  });
});