import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TrainingDetailComponent } from './training-detail.component';
import { TrainingDetailService } from './training-detail.service';
import { ActivatedRoute } from '@angular/router';
import { of, throwError } from 'rxjs';
import { CommonModule } from '@angular/common';

describe('TrainingDetailComponent', () => {
  let component: TrainingDetailComponent;
  let fixture: ComponentFixture<TrainingDetailComponent>;
  let trainingServiceMock: jasmine.SpyObj<TrainingDetailService>;
  let activatedRouteMock: jasmine.SpyObj<ActivatedRoute>;

  beforeEach(() => {
    // Create mock instances
    trainingServiceMock = jasmine.createSpyObj('TrainingDetailService', ['fetchToken', 'getTraining', 'getImageUrl']);
    activatedRouteMock = jasmine.createSpyObj('ActivatedRoute', ['snapshot']);

    // Mock ActivatedRoute to return the trainingId from the route
    activatedRouteMock.snapshot = { paramMap: { get: jasmine.createSpy().and.returnValue('1') } } as any;

    TestBed.configureTestingModule({
      imports: [CommonModule, TrainingDetailComponent],
      providers: [
        { provide: TrainingDetailService, useValue: trainingServiceMock },
        { provide: ActivatedRoute, useValue: activatedRouteMock }
      ]
    });

    fixture = TestBed.createComponent(TrainingDetailComponent);
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should handle the case where field_learning_path_media_image is empty or undefined', () => {
    
    expect(trainingServiceMock.getImageUrl).not.toHaveBeenCalled();  // Should not call getImageUrl if no images
    expect(component.images).toEqual([]);  // Ensure images is an empty string
    expect(component.loading).toBeTrue();
  });
  
  
  it('should handle error when fetching training details', () => {
    // Mock fetchToken to return a valid token
    trainingServiceMock.fetchToken.and.returnValue(of('mockToken'));
    // Mock getTraining to return an error
    trainingServiceMock.getTraining.and.returnValue(throwError('Error fetching training'));

    fixture.detectChanges(); // ngOnInit is called here

    expect(component.loading).toBeFalse();
    expect(component.error).toBe('Failed to load training.');
  });

  it('should handle error when fetching the token', () => {
    // Mock fetchToken to throw an error
    trainingServiceMock.fetchToken.and.returnValue(throwError('Error fetching token'));

    fixture.detectChanges(); // ngOnInit is called here

    expect(component.loading).toBeFalse();
    expect(component.error).toBe('Failed to retrieve a valid token.');
  });
});
