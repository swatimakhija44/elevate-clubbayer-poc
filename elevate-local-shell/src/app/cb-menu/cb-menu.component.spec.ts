import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CbMenuComponent } from './cb-menu.component';

describe('CbMenuComponent', () => {
  let component: CbMenuComponent;
  let fixture: ComponentFixture<CbMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CbMenuComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CbMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
