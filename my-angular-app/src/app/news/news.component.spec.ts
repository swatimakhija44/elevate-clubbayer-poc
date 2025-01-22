import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NewsComponent } from './news.component';
import { NewsService } from '../news.service';
import { of, throwError } from 'rxjs';
import { CommonModule } from '@angular/common';

describe('NewsComponent', () => {
  let component: NewsComponent;
  let fixture: ComponentFixture<NewsComponent>;
  let mockNewsService: jasmine.SpyObj<NewsService>;

  beforeEach(() => {
    // Create the mock NewsService
    mockNewsService = jasmine.createSpyObj('NewsService', ['getNews', 'getImageUrl']);
 // Mock the getNews method to return an observable
 mockNewsService.getNews.and.returnValue(of({
  data: [{type: "node--news", id: "dd1ab18a-d568-487a-82a7-10c437efef8a", attributes
    :{title: 'ss'}, relationships: {field_news_image:{data:{id:"ddd", meta:{title: "ss"}}},body: {value: 'sss'}}}]
}));

// Mock the getImageUrl method to return an observable
mockNewsService.getImageUrl.and.returnValue(of({
  data: { attributes: { uri: { url: 'https://example.com/image.jpg' } } }
}));
    // Configure the TestBed
    TestBed.configureTestingModule({
      imports: [NewsComponent, CommonModule],  // Import NewsComponent and CommonModule
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

  it('should load articles on ngOnInit', () => {
    const mockResponse =  [{type: "node--news", id: "dd1ab18a-d568-487a-82a7-10c437efef8a", attributes
      :{title: 'ss'}, relationships: {field_news_image:{data:{id:"ddd", meta:{title: "ss"}}},body: {value: 'sss'}}}];
    
    // Mock the NewsService's getNews method to return an observable
    mockNewsService.getNews.and.returnValue(of({ data: mockResponse }));

    // Trigger ngOnInit
    component.ngOnInit();
    fixture.detectChanges();

    // Test that the articles are loaded
    expect(component.articles.length).toBe(1);
    
  });

  it('should handle error when loading articles', () => {
    // Mock the NewsService's getNews method to simulate an error
    mockNewsService.getNews.and.returnValue(throwError('Error loading articles'));

    component.ngOnInit();
    fixture.detectChanges();

    // Test that the error is handled correctly
    expect(component.error).toBe('Failed to load articles');
    expect(component.loading).toBe(false);
  });

  it('should fetch images after articles are loaded', () => {
    const mockResponse =  [{type: "node--news", id: "dd1ab18a-d568-487a-82a7-10c437efef8a", attributes
      :{title: 'ss'}, relationships: {field_news_image:{data:{id:"ddd", meta:{title: "ss"}}},body: {value: 'sss'}}}];
    
    const mockImageResponse = { data: { attributes: { uri: { url: 'image_url' } } } };

    // Mock the NewsService's getNews and getImageUrl methods
    mockNewsService.getNews.and.returnValue(of({ data: mockResponse }));
    mockNewsService.getImageUrl.and.returnValue(of(mockImageResponse));

    // Trigger ngOnInit
    component.ngOnInit();
    fixture.detectChanges();

    // Test that images are fetched
    expect(component.images.length).toBe(1);
    expect(component.images[0]).toBe('image_url');
  });

  it('should handle error when fetching images', () => {
    const mockResponse =  [{type: "node--news", id: "dd1ab18a-d568-487a-82a7-10c437efef8a", attributes
      :{title: 'ss'}, relationships: {field_news_image:{data:{id:"ddd", meta:{title: "ss"}}},body: {value: 'sss'}}}];
    

    // Mock the NewsService's getNews and getImageUrl methods
    mockNewsService.getNews.and.returnValue(of({ data: mockResponse }));
    mockNewsService.getImageUrl.and.returnValue(throwError('Error loading image'));

    // Trigger ngOnInit
    component.ngOnInit();
    fixture.detectChanges();

    // Test that images array is still empty due to error
    expect(component.images.length).toBe(0);
  });
});
