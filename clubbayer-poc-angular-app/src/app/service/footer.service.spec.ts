import { TestBed } from '@angular/core/testing';
import { FooterService } from './footer.service';
import { of, throwError } from 'rxjs';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FooterComponent } from '../footer/footer.component';

describe('FooterService', () => {
  let service: FooterService;
  const mockToken = 'fake-token';
  const mockFooterMenuItems = [{ title: 'Menu 1', below: [{ title: 'Submenu 1' }] }];
  const mockFooterPreMenu = [{ title: 'Main Menu 1' }];
  const mockFooterBlockContent = { data: { attributes: { body: { value: '<p>Footer Content</p>' } } } };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, FooterComponent],
      providers: [FooterService]
    });
    service = TestBed.inject(FooterService);
  });

  it('should return token successfully', () => {
    spyOn(service, 'fetchToken').and.returnValue(of(mockToken));

    service.fetchToken().subscribe(token => {
      expect(token).toBe(mockToken);
    });
  });

  it('should handle token fetch failure', () => {
    spyOn(service, 'fetchToken').and.returnValue(throwError(() => new Error('Token fetch failed')));

    service.fetchToken().subscribe({
      error: (err) => {
        expect(err.message).toBe('Token fetch failed');
      }
    });
  });

  it('should fetch footer menu items successfully', () => {
    spyOn(service, 'getFooterMenuItems').and.returnValue(of(mockFooterMenuItems));

    service.getFooterMenuItems().subscribe((items) => {
      expect(items).toEqual(mockFooterMenuItems);
    });
  });

  it('should fetch footer pre-menu items successfully', () => {
    spyOn(service, 'getFooterPreMenu').and.returnValue(of(mockFooterPreMenu));

    service.getFooterPreMenu().subscribe((items) => {
      expect(items).toEqual(mockFooterPreMenu);
    });
  });

  it('should fetch footer block content successfully', () => {
    spyOn(service, 'getFooterBlockContent').and.returnValue(of(mockFooterBlockContent));

    service.getFooterBlockContent().subscribe((content) => {
      expect(content).toEqual(mockFooterBlockContent);
    });
  });

  it('should handle footer menu items fetch failure', () => {
    spyOn(service, 'getFooterMenuItems').and.returnValue(throwError(() => new Error('Failed to fetch footer menu items')));

    service.getFooterMenuItems().subscribe({
      error: (err) => {
        expect(err.message).toBe('Failed to fetch footer menu items');
      }
    });
  });

  it('should handle footer pre-menu fetch failure', () => {
    spyOn(service, 'getFooterPreMenu').and.returnValue(throwError(() => new Error('Failed to fetch footer pre-menu items')));

    service.getFooterPreMenu().subscribe({
      error: (err) => {
        expect(err.message).toBe('Failed to fetch footer pre-menu items');
      }
    });
  });

  it('should handle footer block content fetch failure', () => {
    spyOn(service, 'getFooterBlockContent').and.returnValue(throwError(() => new Error('Failed to fetch footer block content')));

    service.getFooterBlockContent().subscribe({
      error: (err) => {
        expect(err.message).toBe('Failed to fetch footer block content');
      }
    });
  });
});
