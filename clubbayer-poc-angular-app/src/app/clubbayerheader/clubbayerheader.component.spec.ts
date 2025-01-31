import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClubbayerheaderComponent } from './clubbayerheader.component';

describe('ClubbayerheaderComponent', () => {
  let component: ClubbayerheaderComponent;
  let fixture: ComponentFixture<ClubbayerheaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClubbayerheaderComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ClubbayerheaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
