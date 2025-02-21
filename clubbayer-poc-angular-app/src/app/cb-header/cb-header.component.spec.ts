import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CbHeaderComponent } from './cb-header.component';

describe('CbHeaderComponent', () => {
  let component: CbHeaderComponent;
  let fixture: ComponentFixture<CbHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CbHeaderComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(CbHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have logo images', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelectorAll('.logo img').length).toBe(2);
  });

  it('should have six icons', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelectorAll('.iconsList i').length).toBe(6);
  });
});