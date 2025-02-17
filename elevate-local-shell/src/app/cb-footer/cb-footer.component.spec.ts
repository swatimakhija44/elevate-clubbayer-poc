import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CbFooterComponent } from './cb-footer.component';

describe('CbFooterComponent', () => {
  let component: CbFooterComponent;
  let fixture: ComponentFixture<CbFooterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CbFooterComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CbFooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
