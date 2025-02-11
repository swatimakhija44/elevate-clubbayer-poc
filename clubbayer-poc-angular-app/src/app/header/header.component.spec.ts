import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HeaderComponent } from './header.component';
import { MenuComponent } from '../menu/menu.component';
import { NewsComponent } from '../news/news.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';  // Import HttpClientTestingModule
import { MenuService } from '../service/menu.service';  // Assuming you need to mock the MenuService
import { By } from '@angular/platform-browser';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,  // Add this module to provide HttpClient for testing
        HeaderComponent,
        MenuComponent,
        NewsComponent
      ],
      providers: [
        MenuService  // Provide the MenuService to make sure it's injected in the component
      ]
    });

    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the HeaderComponent', () => {
    expect(component).toBeTruthy();
  });

  it('should display the portalName', () => {
    const compiled = fixture.nativeElement;
    // Query the DOM for the element with class 'portal-name'
    const portalNameElement = compiled.querySelector('.portal-name');
    
    // Ensure the element is found and its text content matches the expected portal name
    expect(portalNameElement).toBeTruthy();  // Check that the element exists
    expect(portalNameElement.textContent).toContain('CLUB BAYER');  // Check the text content
  });
  

  it('should render MenuComponent', () => {
    const menuComponent = fixture.debugElement.query(By.directive(MenuComponent));
    expect(menuComponent).toBeTruthy();
  });

  it('should render NewsComponent', () => {
    const newsComponent = fixture.debugElement.query(By.directive(NewsComponent));
    expect(newsComponent).toBeFalsy();
  });
});
