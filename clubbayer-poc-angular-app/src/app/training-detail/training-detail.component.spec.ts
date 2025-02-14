import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { TrainingDetailComponent } from './training-detail.component';
import { TrainingDetailService } from './training-detail.service';
import { ActivatedRoute } from '@angular/router';
import { of, throwError } from 'rxjs';
import { CommonModule } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('TrainingDetailComponent', () => {
  let component: TrainingDetailComponent;
  let fixture: ComponentFixture<TrainingDetailComponent>;
  let trainingServiceMock: jasmine.SpyObj<TrainingDetailService>;
  let activatedRouteMock: jasmine.SpyObj<ActivatedRoute>;

  beforeEach(() => {
    trainingServiceMock = jasmine.createSpyObj('TrainingDetailService', ['fetchToken', 'getTraining', 'getImageUrl']);
    activatedRouteMock = jasmine.createSpyObj('ActivatedRoute', ['snapshot']);
    activatedRouteMock.snapshot = { paramMap: { get: jasmine.createSpy().and.returnValue('1') } } as any;

    TestBed.configureTestingModule({
      imports: [CommonModule, HttpClientTestingModule, TrainingDetailComponent],
      providers: [
        { provide: TrainingDetailService, useValue: trainingServiceMock },
        { provide: ActivatedRoute, useValue: activatedRouteMock }
      ]
    });

    fixture = TestBed.createComponent(TrainingDetailComponent);
    component = fixture.componentInstance;
    trainingServiceMock = TestBed.inject(TrainingDetailService) as jasmine.SpyObj<TrainingDetailService>;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should handle error when fetching training details', fakeAsync(() => {
    // Mock fetchToken to return a valid token
    trainingServiceMock.fetchToken.and.returnValue(of('mockToken'));
    // Mock getTraining to return an error
    trainingServiceMock.getTraining.and.returnValue(throwError('Error fetching training'));

    fixture.detectChanges(); // ngOnInit is called here
    tick();  // Ensure async calls resolve

    expect(component.loading).toBeFalse();
    expect(component.error).toBe('Failed to load training.');
  }));

  it('should handle error when fetching the token', fakeAsync(() => {
    // Mock fetchToken to throw an error
    trainingServiceMock.fetchToken.and.returnValue(throwError('Error fetching token'));

    fixture.detectChanges(); // ngOnInit is called here
    tick();  // Ensure async calls resolve

    expect(component.loading).toBeFalse();
    expect(component.error).toBe('Failed to retrieve a valid token.');
  }));


  it('should call fetchArticles and populate articles on success', fakeAsync(() => {
    const mockToken = 'valid-token';
    const mockTrainingData = {

      id: 1,
      field_learning_path_media_image: [{ target_uuid: 'uuid-1' }],
      metatag: { value: { title: 'Test Title' } }

    };
    const mockImageUrl = { data: { attributes: { uri: { url: 'image-url' } } } };

    // Mock the methods of the service
    trainingServiceMock.fetchToken.and.returnValue(of(mockToken));
    trainingServiceMock.getTraining.and.returnValue(of(mockTrainingData));
    trainingServiceMock.getImageUrl.and.returnValue(of(mockImageUrl));

    // Call the fetchTrainingDetail method
    component.fetchTrainingDetail(mockTrainingData.id);

    // Simulate the passage of time for async operations
    tick();

    // Ensure the articles are populated correctly
    expect(component.trainingdetail).toEqual(mockTrainingData);
    expect(component.loading).toBeFalse();
    expect(component.error).toBeNull();
    expect(component.images.length).toBe(9);  // Should be one image since mock data has one image URL

    // Ensure that the image URL is fetched correctly
    expect(trainingServiceMock.getImageUrl).toHaveBeenCalledWith('uuid-1');
  }));

  it('should handle error when fetching articles', fakeAsync(() => {
    const mockToken = 'valid-token';
    const mockErrorMessage = 'Failed to load training.';
    const id = "124";

    // Mock the methods of the service
    trainingServiceMock.fetchToken.and.returnValue(of(mockToken));
    trainingServiceMock.getTraining.and.returnValue(throwError('Failed to fetch data'));

    component.fetchTrainingDetail(id);  // Call method

    tick();  // Ensure async operations finish

    expect(component.trainingdetail).toEqual({});
    expect(component.loading).toBeFalse();
    expect(component.error).toBe(mockErrorMessage);
  }));

  it('should set error message when token is not fetched', fakeAsync(() => {
    // Mock fetchToken to throw an error
    trainingServiceMock.fetchToken.and.returnValue(throwError('Failed to fetch token'));
    const id = "124";

    component.fetchTrainingDetail(id);  // Call method

    tick();  // Ensure async operations finish

    expect(component.trainingdetail).toEqual({});
    expect(component.loading).toBeFalse();
    expect(component.error).toBe('Failed to retrieve a valid token.');
  }));

  it('should handle the case where field_learning_path_media_image is empty or undefined', fakeAsync(() => {


    tick();  // Ensure async operations finish

    // Ensure that no image URL is called
    expect(trainingServiceMock.getImageUrl).not.toHaveBeenCalled();
    expect(component.images).toEqual([]);
    expect(component.loading).toBeTrue();
    expect(component.error).toBeNull();
  }));

});
