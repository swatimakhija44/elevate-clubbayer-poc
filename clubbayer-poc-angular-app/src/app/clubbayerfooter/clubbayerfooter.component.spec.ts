import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ClubbayerfooterComponent } from './clubbayerfooter.component';
import { FooterService } from '../service/footer.service';
import { HttpClientModule } from '@angular/common/http';
import { of, throwError } from 'rxjs';
import { environment } from '../../environments/environment';

describe('ClubbayerfooterComponent', () => {

  let component: ClubbayerfooterComponent;
  let fixture: ComponentFixture<ClubbayerfooterComponent>;
  let mockFooterService: jasmine.SpyObj<FooterService>;

  beforeEach(() => {
    // Create a spy for the FooterService
    mockFooterService = jasmine.createSpyObj('FooterService', ['fetchToken', 'getFooterMenuItems', 'getFooterPreMenu', 'getFooterBlockContent']);

    // Set up the TestBed
    TestBed.configureTestingModule({
      imports: [HttpClientModule, ClubbayerfooterComponent],
      providers: [
        { provide: FooterService, useValue: mockFooterService },
      ],
    });

    fixture = TestBed.createComponent(ClubbayerfooterComponent);
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should load articles successfully', () => {
    const mockToken = 'fake-token';
    const mockNewsData = {
      data: [{ title: "title 1", below: [{ title: "subtitle 1", }] }]
    };

    mockFooterService.fetchToken.and.returnValue(of(mockToken));
    mockFooterService.getFooterMenuItems.and.returnValue(of(mockNewsData));

    component.ngOnInit();
    fixture.detectChanges();
    expect(component.articles.length).toBe(1);
    expect(component.articles[0].title).toBe('title 1');
    expect(component.loading).toBeFalse();
  });

  it('should handle error when fetching token fails', () => {
    mockFooterService.fetchToken.and.returnValue(throwError('Token error'));
    component.ngOnInit();
    fixture.detectChanges();
    expect(component.loading).toBeFalse();
    expect(component.error).toBe('Failed to retrieve a valid token.');
  });

  it('should handle error when fetching news fails', () => {
    const mockToken = 'fake-token';
    mockFooterService.fetchToken.and.returnValue(of(mockToken));
    mockFooterService.getFooterMenuItems.and.returnValue(throwError('News fetching error'));
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
    mockFooterService.fetchToken.and.returnValue(of(mockToken));
    mockFooterService.getFooterMenuItems.and.returnValue(of(mockNewsData));
    mockFooterService.getFooterPreMenu.and.returnValue(of(mockImageData));
    component.ngOnInit();
    fixture.detectChanges();

    // expect(component.images.length).toBe(1);
    // expect(component.images[0]).toBe(`${environment.DRUPAL_BASE_URL}/jsonapi/file/mime_attachment_binary`);
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
    mockFooterService.fetchToken.and.returnValue(of(mockToken));
    mockFooterService.getFooterMenuItems.and.returnValue(of(mockNewsData));
    mockFooterService.getFooterPreMenu.and.returnValue(throwError('Image loading error'));
    component.ngOnInit();
    fixture.detectChanges();
    // expect(component.images.length).toBe(1);
    expect(component.error).toBeNull();
  });
});