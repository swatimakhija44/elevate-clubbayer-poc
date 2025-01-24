import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MenuComponent } from './menu.component'; // Standalone component
import { MenuService } from '../service/menu.service';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router'; // Import ActivatedRoute
import { MenuItem } from './menu-item.model';
import { of, throwError } from 'rxjs';

// Mock ActivatedRoute for testing purposes
class ActivatedRouteStub {
  // You can mock specific properties if needed
  snapshot = { paramMap: new Map() };
}

const menuItem: MenuItem = {
  id: 1,
  name: 'Menu Item 1',
  title: 'Main Menu Item',  // Required property
  key: 'menu-item-1',       // Required property
  enabled: true,
  below: []                 
};

describe('MenuComponent', () => {
  let component: MenuComponent;
  let fixture: ComponentFixture<MenuComponent>;
  let menuServiceMock: jasmine.SpyObj<MenuService>;

  beforeEach(async () => {
    // Create a mock of the MenuService
    menuServiceMock = jasmine.createSpyObj('MenuService', ['fetchToken', 'getMenu']);

    await TestBed.configureTestingModule({
      imports: [CommonModule, RouterModule, MenuComponent], // Import MenuComponent and RouterModule
      providers: [
        { provide: MenuService, useValue: menuServiceMock },
        { provide: ActivatedRoute, useClass: ActivatedRouteStub }
      ]
    }).compileComponents();
    
    fixture = TestBed.createComponent(MenuComponent);
    component = fixture.componentInstance;
  });

  it('should create the MenuComponent', () => {
    expect(component).toBeTruthy();
  });

  it('should set loading to false when token is fetched successfully', () => {
    const mockToken = { access_token: 'mock_token' };
    const mockMenuItems: MenuItem[] = [{ id: 1, name: 'Item 1', enabled: true, below: [] }];
  
    // Return mock observables from the service
    menuServiceMock.fetchToken.and.returnValue(of(mockToken)); 
    menuServiceMock.getMenu.and.returnValue(of(mockMenuItems)); // Make sure `getMenu` returns an observable as well
  
    // Initialize component and call ngOnInit
    component.ngOnInit();
    fixture.detectChanges();
  
    // Assertions to verify behavior
    expect(component.loading).toBeFalse();
    expect(component.menu).toEqual(mockMenuItems);
    expect(component.flatMenuItems.length).toBeGreaterThan(0);
  });

  it('should handle error if fetching the token fails', () => {
    // Arrange: Mock service to return an error
    menuServiceMock.fetchToken.and.returnValue(throwError('Token fetch error'));

    // Act: Call ngOnInit
    component.ngOnInit();
    fixture.detectChanges();

    // Assert: Check that loading is set to false
    expect(component.loading).toBeFalse();
  });

  it('should handle error if fetching the menu fails', () => {
    // Arrange: Mock successful token fetch but failed menu fetch
    const mockToken = { access_token: 'mock_token' };
    menuServiceMock.fetchToken.and.returnValue(of(mockToken));
    menuServiceMock.getMenu.and.returnValue(throwError('Menu fetch error'));

    // Act: Call ngOnInit
    component.ngOnInit();
    fixture.detectChanges();

    // Assert: Check that loading is set to false
    expect(component.loading).toBeFalse();
    expect(component.menu).toEqual([]);
  });

  it('should process menu items correctly', () => {
    // Arrange: Sample menu data
    const mockMenuItems: MenuItem[] = [
      { id: 1, name: 'Item 1', enabled: true, below: [{ id: 2, name: 'Subitem 1', enabled: true }] },
      { id: 3, name: 'Item 2', enabled: false, below: [] },
      { id: 4, name: 'Item 3', enabled: true, below: [] },
    ];

    // Act: Process the menu items
    component.menu = mockMenuItems;
    component.processMenuItems();
    fixture.detectChanges();

    // Assert: Check if the flatMenuItems array contains processed items
    expect(component.flatMenuItems.length).toBe(2); // Only 2 items should be enabled (Item 1 and Item 3)
    expect(component.flatMenuItems[0].name).toBe('Item 1');
    expect(component.flatMenuItems[1].name).toBe('Item 3');
  });

  it('should handle the menu with sub-items correctly', () => {
    // Arrange: Sample menu with sub-items
    const mockMenuItems: MenuItem[] = [
      { id: 1, name: 'Item 1', enabled: true, below: [{ id: 2, name: 'Subitem 1', enabled: true }] }
    ];
  
    // Act: Process the menu items
    component.menu = mockMenuItems;
    component.processMenuItems();
    fixture.detectChanges();
  
    // Assert: Ensure the sub-item is included in the flatMenuItems
    expect(component.flatMenuItems.length).toBe(1); // Parent Item 1
    expect(component.flatMenuItems[0].name).toBe('Item 1');
    
    // Use optional chaining to safely access 'below' and its length
    expect(component.flatMenuItems[0]?.below?.length).toBe(1);
  });
});
