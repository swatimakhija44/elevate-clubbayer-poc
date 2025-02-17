import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FooterComponent } from './footer.component';
import { of, throwError } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FooterService } from '../service/footer.service';

describe('FooterComponent', () => {
  let component: FooterComponent;
  let fixture: ComponentFixture<FooterComponent>;
  let mockFooterService: jasmine.SpyObj<FooterService>;

  beforeEach(async () => {
    mockFooterService = jasmine.createSpyObj('FooterService', [
      'fetchToken',
      'getFooterMenuItems',
      'getFooterPreMenu',
      'getFooterBlockContent',
    ]);

    await TestBed.configureTestingModule({
      declarations: [FooterComponent],
      imports: [CommonModule],
      providers: [{ provide: FooterService, useValue: mockFooterService }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FooterComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch footer data successfully', () => {
    const mockToken = 'valid_token';
    const mockMenuItems = [{ title: 'Home', below: [{ title: 'Submenu1' }] }];
    const mockPreMenuItems = [{ title: 'About Us' }];
    const mockBlockContent = { data: { attributes: { body: { value: '<p>Footer Content</p>' } } } };

    mockFooterService.fetchToken.and.returnValue(of(mockToken));
    mockFooterService.getFooterMenuItems.and.returnValue(of(mockMenuItems));
    mockFooterService.getFooterPreMenu.and.returnValue(of(mockPreMenuItems));
    mockFooterService.getFooterBlockContent.and.returnValue(of(mockBlockContent));

    fixture.detectChanges();

    expect(component.footerMenuItem).toEqual([
      { title: 'Home', belowTitles: ['Submenu1'] }
    ]);
    expect(component.footerMainMenuItem).toEqual([{ mainTitle: 'About Us' }]);
    expect(component.footerBlockItem).toEqual([{ blockContent: 'Footer Content' }]);
    expect(component.loading).toBeFalse();
    expect(component.error).toBeNull();
  });

  it('should handle token fetch failure', () => {
    mockFooterService.fetchToken.and.returnValue(of(null));

    fixture.detectChanges();

    expect(component.error).toBe('Failed to retrieve a valid token.');
    expect(component.loading).toBeFalse();
  });

  it('should handle API errors gracefully', () => {
    const mockToken = 'valid_token';
    mockFooterService.fetchToken.and.returnValue(of(mockToken));
    mockFooterService.getFooterMenuItems.and.returnValue(throwError(() => new Error('API Error')));
    mockFooterService.getFooterPreMenu.and.returnValue(of([]));
    mockFooterService.getFooterBlockContent.and.returnValue(of([]));

    fixture.detectChanges();

    expect(component.error).toBe('Failed to load footer data.');
    expect(component.loading).toBeFalse();
  });
});
