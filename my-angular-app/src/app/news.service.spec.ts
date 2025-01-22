import { TestBed } from '@angular/core/testing';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { NewsService } from './news.service';
import { HttpClientTestingModule } from '@angular/common/http/testing'; 
import { of } from 'rxjs';
import { NewsComponent } from './news/news.component';

describe('NewsComponent', () => {
  let component: NewsComponent;
  let newsService: NewsService;
  let httpClientSpy: jasmine.SpyObj<HttpClient>;
  beforeEach(() => {
    // Create a spy for HttpClient
    httpClientSpy = jasmine.createSpyObj('HttpClient', ['get']);
     // Configure the TestBed for the standalone component
     TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, NewsComponent], // Use HttpClientTestingModule for mocking
      providers: [
        NewsService,
        { provide: HttpClient, useValue: httpClientSpy } // Use the spy for HttpClient
      ]
    });

    // Inject the component and service
    component = TestBed.createComponent(NewsComponent).componentInstance;
    newsService = TestBed.inject(NewsService);
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  describe('getNews', () => {
    it('should call HttpClient.get with correct URL and headers', () => {
      const mockResponse = [{ title: 'News article 1' }, { title: 'News article 2' }];
      httpClientSpy.get.and.returnValue(of(mockResponse)); // Mock HTTP response
    
      const expectedUrl = 'https://cors-anywhere.herokuapp.com/https://chhcpportalode4.prod.acquia-sites.com/jsonapi/node/news';
      const expectedHeaders = new HttpHeaders().set('X-Skip-Interceptor', 'true');
      
      newsService.getNews().subscribe((data) => {
        expect(data).toEqual(mockResponse);
      });
    
      // Check if HttpClient.get was called with the correct URL and headers
      expect(httpClientSpy.get).toHaveBeenCalledWith(expectedUrl, { headers: expectedHeaders });
    });
    

    it('should return an empty array if no news found', () => {
      const mockResponse: any = [];
      httpClientSpy.get.and.returnValue(of(mockResponse)); // Mock HTTP response

      newsService.getNews().subscribe((data) => {
        expect(data).toEqual(mockResponse);
      });
    });
  });

  describe('getImageUrl', () => {
    it('should call HttpClient.get with the correct fileId URL', () => {
      const fileId = '123';
      const mockResponse = { url: 'https://chhcpportalode4.prod.acquia-sites.com/jsonapi/file/mime_attachment_binary' };
      httpClientSpy.get.and.returnValue(of(mockResponse)); // Mock HTTP response
    
      newsService.getImageUrl(fileId).subscribe((data) => {
        expect(data).toEqual(mockResponse);
      });
    
      // Ensure the spy is called with the correct URL
      expect(httpClientSpy.get).toHaveBeenCalledWith('https://chhcpportalode4.prod.acquia-sites.com/jsonapi/file/mime_attachment_binary/123'); // Adjust with your actual base URL
    });
    
  });
});
