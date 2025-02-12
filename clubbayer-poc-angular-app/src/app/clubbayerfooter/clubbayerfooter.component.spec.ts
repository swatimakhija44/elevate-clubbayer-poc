import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ClubbayerfooterComponent } from './clubbayerfooter.component';
import { FooterService } from '../service/footer.service';
import { HttpClientModule } from '@angular/common/http';
import { of, throwError } from 'rxjs';

describe('ClubbayerfooterComponent', () => {

  let component: ClubbayerfooterComponent;
  let fixture: ComponentFixture<ClubbayerfooterComponent>;
  let mockFooterService: jasmine.SpyObj<FooterService>;

  beforeEach(async () => {
    // Mock FooterService with spies
    mockFooterService = jasmine.createSpyObj('FooterService', [
      'fetchToken',
      'getFooterMenuItems',
      'getFooterPreMenu',
      'getFooterBlockContent'
    ]);

    await TestBed.configureTestingModule({
      // imports: [CommonModule, HttpClientTestingModule], // Import necessary modules
      // declarations: [ClubbayerfooterComponent], // Declare component
      imports: [HttpClientModule, ClubbayerfooterComponent],
      providers: [{ provide: FooterService, useValue: mockFooterService }] // Provide mock service
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ClubbayerfooterComponent);
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch footer data successfully', fakeAsync(() => {
    // Mock successful token response
    mockFooterService.fetchToken.and.returnValue(of('valid_token'));

    // Mock footer service responses
    mockFooterService.getFooterMenuItems.and.returnValue(of([{ title: 'Menu 1', below: [{ title: 'Submenu 1' }] }]));
    mockFooterService.getFooterPreMenu.and.returnValue(of([{ title: 'Main Menu 1' }]));
    mockFooterService.getFooterBlockContent.and.returnValue(
      of({ data: { attributes: { body: { value: '<p>Footer Content</p>' } } } })
    );

    component.ngOnInit(); // Trigger data fetch
    tick(); // Simulate async completion

    expect(component.loading).toBeFalse();
    // expect(component.error).toBeNull();
    expect(component.footerMenuItem.length).toBe(1);
    expect(component.footerMainMenuItem.length).toBe(1);
    expect(component.footerBlockItem[0].blockContent).toBe('Footer Content'); // Ensuring HTML tags are removed
  }));

  it('should handle token fetch failure', fakeAsync(() => {
    mockFooterService.fetchToken.and.returnValue(of(null)); // Simulating token failure

    component.ngOnInit();
    tick();

    expect(component.loading).toBeFalse();
    expect(component.error).toBe('Failed to retrieve a valid token.');
  }));

  it('should handle error during footer data fetch', fakeAsync(() => {
    mockFooterService.fetchToken.and.returnValue(of('valid_token'));

    // Simulating an API error for one of the requests
    mockFooterService.getFooterMenuItems.and.returnValue(of([{ title: 'Menu 1' }]));
    mockFooterService.getFooterPreMenu.and.returnValue(throwError(() => new Error('API error')));
    mockFooterService.getFooterBlockContent.and.returnValue(of({}));

    component.ngOnInit();
    tick();

    expect(component.loading).toBeFalse();
    expect(component.error).toBe('Failed to load footer data.');
  }));

  it('should transform menu items correctly', () => {
    const mockData = [
      { title: 'Menu 1', below: [{ title: 'Submenu 1' }, { title: 'Submenu 2' }] }
    ];
    const transformed = component['transformMenuItems'](mockData);

    expect(transformed).toEqual([
      { title: 'Menu 1', belowTitles: ['Submenu 1', 'Submenu 2'] }
    ]);
  });

  it('should extract block content correctly', () => {
    const mockData = { data: { attributes: { body: { value: '<p>Test Content</p>' } } } };
    const transformed = component['extractBlockContent'](mockData);

    expect(transformed).toEqual([{ blockContent: 'Test Content' }]);
  });

  it('should handle errors correctly', () => {
    component['handleError']('Test error message');

    expect(component.loading).toBeFalse();
    expect(component.error).toBe('Test error message');
  });
});
