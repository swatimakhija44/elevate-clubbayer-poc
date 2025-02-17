import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { FooterService } from './footer.service';
import { of, throwError } from 'rxjs';
import { FooterComponent } from '../footer/footer.component';
import { environment } from '../../environments/environments';

describe('FooterService', () => {
  let component: FooterComponent;
  let service: FooterService;
  let httpMock: HttpTestingController;

  const mockToken = 'fake-token';
  const mockFooterMenuItems = [{ title: 'Menu 1', below: [{ title: 'Submenu 1' }] }];
  const mockFooterPreMenu = [{ title: 'Main Menu 1' }];
  const mockFooterBlockContent = { data: { attributes: { body: { value: '<p>Footer Content</p>' } } } };


  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, FooterComponent],
      providers: [FooterService],
    });
    service = TestBed.inject(FooterService);
    httpMock = TestBed.inject(HttpTestingController);

    component = TestBed.createComponent(FooterComponent).componentInstance;
    service = TestBed.inject(FooterService);
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

  it('should fetch footer menu items successfully', (done) => {
    spyOn(service, 'getFooterMenuItems').and.returnValue(of(mockFooterMenuItems));
    service.getFooterMenuItems().subscribe((items) => {
      expect(items).toEqual(mockFooterMenuItems);
      done();
    });
  });

  it('should fetch footer pre-menu successfully', (done) => {
    spyOn(service, 'getFooterPreMenu').and.returnValue(of(mockFooterPreMenu));
    service.getFooterPreMenu().subscribe((items) => {
      expect(items).toEqual(mockFooterPreMenu);
      done();
    });
  });

  it('should fetch footer block content successfully', (done) => {
    spyOn(service, 'getFooterBlockContent').and.returnValue(of(mockFooterBlockContent));
    service.getFooterBlockContent().subscribe((content) => {
      expect(content).toEqual(mockFooterBlockContent);
      done();
    });
  });

  it('should handle error when fetching token fails', (done) => {
    spyOn(service, 'fetchToken').and.returnValue(throwError(() => new Error('Token fetch error')));
    service.fetchToken().subscribe({
      next: () => {},
      error: (error) => {
        expect(error.message).toBe('Token fetch error');
        done();
      },
    });
  });
});