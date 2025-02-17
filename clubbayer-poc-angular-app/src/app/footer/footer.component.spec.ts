import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FooterComponent } from './footer.component';
import { of, throwError } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FooterService } from '../service/footer.service';

describe('FooterComponent', () => {
  let component: FooterComponent;
  let fixture: ComponentFixture<FooterComponent>;
  let mockFooterService: jasmine.SpyObj<FooterService>;

  beforeEach(() => {
    const footerServiceSpy = jasmine.createSpyObj('FooterService', [
      'fetchToken',
      'getFooterMenuItems',
      'getFooterPreMenu',
      'getFooterBlockContent',
    ]);

    TestBed.configureTestingModule({
      imports: [CommonModule, FooterComponent],
      providers: [{ provide: FooterService, useValue: footerServiceSpy },]
    }).compileComponents();

    fixture = TestBed.createComponent(FooterComponent);
    component = fixture.componentInstance;
    mockFooterService = TestBed.inject(FooterService) as jasmine.SpyObj<FooterService>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should handle token fetch failure', () => {
    mockFooterService.fetchToken.and.returnValue(throwError(() => new Error('Token fetch failed')));

    component.ngOnInit();

    fixture.detectChanges();
    expect(component.error).toBe('Failed to retrieve a valid token.');
    expect(component.loading).toBeFalse();
  });

  it('should handle API errors gracefully', () => {
    mockFooterService.fetchToken.and.returnValue(of('valid-token'));
    mockFooterService.getFooterMenuItems.and.returnValue(throwError(() => new Error('API call failed')));

    component.ngOnInit();

    fixture.detectChanges();
    expect(component.error).toBe('API call failed');
    expect(component.loading).toBeFalse();
  });

  it('should fetch footer data successfully', () => {
    const mockMenuItems = [{ title: 'Item 1', below: [{ title: 'Submenu1' }] }];
    const mockPreMenuItems = [{ title: 'Pre-Item 1' }];
    const mockBlockContent = { data: { attributes: { body: { value: '<p>Footer Content</p>' } } } };

    mockFooterService.fetchToken.and.returnValue(of('valid-token'));
    mockFooterService.getFooterMenuItems.and.returnValue(of(mockMenuItems));
    mockFooterService.getFooterPreMenu.and.returnValue(of(mockPreMenuItems));
    mockFooterService.getFooterBlockContent.and.returnValue(of(mockBlockContent));

    component.ngOnInit();

    fixture.detectChanges();

    expect(component.footerMenuItem).toEqual([{ title: 'Item 1', belowTitles: ['Submenu1'] }]);
    expect(component.footerMainMenuItem).toEqual([{ mainTitle: 'Pre-Item 1' }]);
    expect(component.footerBlockItem).toEqual([{ blockContent: 'Footer Content' }]);
    expect(component.loading).toBeFalse();
  });

});


