import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClubbayerfooterComponent } from './clubbayerfooter.component';

describe('ClubbayerfooterComponent', () => {
  let component: ClubbayerfooterComponent;
  let fixture: ComponentFixture<ClubbayerfooterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClubbayerfooterComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ClubbayerfooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
