import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
import { NewsComponent } from './news.component';
import { NewsService } from '../news.service';
import { of, throwError } from 'rxjs';
import { environment } from '../../environments/environments';

describe('NewsComponent', () => {
  let component: NewsComponent;
  let fixture: ComponentFixture<NewsComponent>;
  let mockNewsService: jasmine.SpyObj<NewsService>;

  beforeEach(() => {
    // Create a spy for the NewsService
    mockNewsService = jasmine.createSpyObj('NewsService', ['fetchToken', 'getNews', 'getImageUrl']);

    // Set up the TestBed
    TestBed.configureTestingModule({
      imports: [HttpClientModule, NewsComponent],
      providers: [
        { provide: NewsService, useValue: mockNewsService },
      ],
    });

    fixture = TestBed.createComponent(NewsComponent);
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should load articles successfully', () => {
    const mockToken = 'fake-token';
    const mockNewsData = {
      data: [{ attributes: { title: 'Article 1', body: 'Content' } }],
    };


    mockNewsService.fetchToken.and.returnValue(of(mockToken));

    mockNewsService.getNews.and.returnValue(of(mockNewsData));


    component.ngOnInit();
    fixture.detectChanges();


    expect(component.articles.length).toBe(1);
    expect(component.articles[0].attributes.title).toBe('Article 1');
    expect(component.loading).toBeFalse();
  });

  it('should handle error when fetching token fails', () => {

    mockNewsService.fetchToken.and.returnValue(throwError('Token error'));

    component.ngOnInit();
    fixture.detectChanges();


    expect(component.loading).toBeFalse();
    expect(component.error).toBe('Failed to retrieve a valid token.');
  });

  it('should handle error when fetching news fails', () => {
    const mockToken = 'fake-token';


    mockNewsService.fetchToken.and.returnValue(of(mockToken));

    mockNewsService.getNews.and.returnValue(throwError('News fetching error'));

    component.ngOnInit();
    fixture.detectChanges();


    expect(component.loading).toBeFalse();
    expect(component.error).toBe('Failed to load news.');
  });

  it('should fetch images for articles', () => {
    const mockToken = '133';
    const mockNewsData = {
      data: [
        {
          relationships: { field_news_image: { data: { id: 'image-id' } } },
          attributes: { title: 'Article 1', body: 'Content' },
        },
      ],
    };

    const mockImageData = {
      data: { attributes: { uri: { url: `${environment.DRUPAL_BASE_URL}/jsonapi/file/mime_attachment_binary` } } },
    };


    mockNewsService.fetchToken.and.returnValue(of(mockToken));

    mockNewsService.getNews.and.returnValue(of(mockNewsData));

    mockNewsService.getImageUrl.and.returnValue(of(mockImageData));

    component.ngOnInit();
    fixture.detectChanges();


    expect(component.images.length).toBe(1);
    expect(component.images[0]).toBe(`${environment.DRUPAL_BASE_URL}/jsonapi/file/mime_attachment_binary`);
  });

  it('should handle error when fetching image fails', () => {
    const mockToken = 'fake-token';
    const mockNewsData = {
      data: [
        {
          relationships: { field_news_image: { data: { id: 'image-id' } } },
          attributes: { title: 'Article 1', body: 'Content' },
        },
      ],
    };


    mockNewsService.fetchToken.and.returnValue(of(mockToken));

    mockNewsService.getNews.and.returnValue(of(mockNewsData));

    mockNewsService.getImageUrl.and.returnValue(throwError('Image loading error'));

    component.ngOnInit();
    fixture.detectChanges();


    expect(component.images.length).toBe(1);
    expect(component.error).toBeNull();
  });
});
