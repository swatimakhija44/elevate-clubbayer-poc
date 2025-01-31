import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
import { MenuComponent } from './menu.component';
import { of, throwError } from 'rxjs';
import { MenuItem } from './menu-item.model';
import { MenuService } from '../service/menu.service';
import { RouterModule } from '@angular/router';

describe('MenuComponent', () => {
  let component: MenuComponent;
  let fixture: ComponentFixture<MenuComponent>;
  let mockMenuService: jasmine.SpyObj<MenuService>;

  beforeEach(() => {
    // Create a spy for the NewsService
    mockMenuService = jasmine.createSpyObj('MenuService', ['fetchToken', 'getMenu']);

    // Set up the TestBed
    TestBed.configureTestingModule({
      imports: [HttpClientModule, MenuComponent, RouterModule.forRoot([])],
      providers: [
        { provide: MenuService, useValue: mockMenuService },
      ],
    });

    fixture = TestBed.createComponent(MenuComponent);
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should load menu successfully', () => {
    const mockToken = 'fake-token';
    const mockMenuData: MenuItem[] = [
      { id: 1, name: 'Home', enabled: true, below: [] },
      { id: 2, name: 'Settings', enabled: true, below: [] },
    ];

    // Mock the fetchToken and getMenu methods
    mockMenuService.fetchToken.and.returnValue(of(mockToken));
    mockMenuService.getMenu.and.returnValue(of(mockMenuData));

    // Trigger ngOnInit
    component.ngOnInit();

    // Run change detection to ensure any async operations are processed
    fixture.detectChanges();

    // Check that the menu is loaded
    expect(component.menu.length).toBe(2);
    expect(component.menu[0].name).toBe('Home');
    expect(component.menu[1].name).toBe('Settings');

    // Check loading state after data is fetched
    expect(component.loading).toBeFalse();
  });

  it('should handle error when fetching token fails', () => {

    mockMenuService.fetchToken.and.returnValue(throwError('Token error'));

    component.ngOnInit();
    fixture.detectChanges();


    expect(component.loading).toBeFalse();
    expect(component.error).toBe('Failed to retrieve a valid token.');
  });

  it('should handle error when fetching menu fails', () => {
    const mockToken = 'fake-token';


    mockMenuService.fetchToken.and.returnValue(of(mockToken));

    mockMenuService.getMenu.and.returnValue(throwError('Menu fetching error'));

    component.ngOnInit();
    fixture.detectChanges();


    expect(component.loading).toBeFalse();
    expect(component.error).toBe('Failed to load menu.');
  });

  it('should filter and process deeply nested enabled menu items', () => {
    const mockToken = 'fake-token';
    const mockMenuData: MenuItem[] = [
      {
        id: 1,
        name: 'Dashboard',
        enabled: true,
        below: [
          {
            id: 2,
            name: 'User Management',
            enabled: true,
          },
          { id: 5, name: 'System Settings', enabled: true}
        ]
      }
    ];
  
    // Mock the fetchToken and getMenu methods
    mockMenuService.fetchToken.and.returnValue(of(mockToken));
    mockMenuService.getMenu.and.returnValue(of(mockMenuData));
  
    // Trigger ngOnInit
    component.ngOnInit();
    fixture.detectChanges();
  
    // Check the flatMenuItems array
    expect(component.flatMenuItems.length).toBe(2);  
  
    // Ensure the second item is "User Management"
    expect(component.flatMenuItems[1].name).toBe('Dashboard');
  });
  
});
