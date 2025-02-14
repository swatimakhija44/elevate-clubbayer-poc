import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TrainingComponent } from './training.component';
import { TrainingService } from './training.service';
import { of, throwError } from 'rxjs';
import { CommonModule } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('TrainingComponent', () => {
  let component: TrainingComponent;
  let fixture: ComponentFixture<TrainingComponent>;
  let mockTrainingService: jasmine.SpyObj<TrainingService>;

  beforeEach(() => {
    const spy = jasmine.createSpyObj('TrainingService', ['fetchToken', 'getTraining', 'getImageUrl', 'updateTitle']);

    TestBed.configureTestingModule({
      imports: [CommonModule, HttpClientTestingModule, TrainingComponent],
      providers: [
        { provide: TrainingService, useValue: spy }
      ]
    });

    fixture = TestBed.createComponent(TrainingComponent);
    component = fixture.componentInstance;
    mockTrainingService = TestBed.inject(TrainingService) as jasmine.SpyObj<TrainingService>;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should call fetchArticles and populate articles on success', () => {
    const mockToken = 'valid-token';
    const mockTrainingData = [{ id: 1, field_learning_path_media_image: [{ target_uuid: 'uuid-1' }], metatag: { value: { title: 'Test Title' } } }];
    const mockImageUrl = { data: { attributes: { uri: { url: 'image-url' } } } };

    // Mock the methods of the service
    mockTrainingService.fetchToken.and.returnValue(of(mockToken));
    mockTrainingService.getTraining.and.returnValue(of(mockTrainingData));
    mockTrainingService.getImageUrl.and.returnValue(of(mockImageUrl));

    // Call the fetchArticles method
    component.fetchArticles();

    // Assert that the articles are populated
    expect(component.articles).toEqual(mockTrainingData);
    expect(component.loading).toBeFalse();
    expect(component.error).toBeNull();
    expect(component.images.length).toBe(1);
  });

  it('should handle error when fetching articles', () => {
    const mockToken = 'valid-token';
    const mockErrorMessage = 'Failed to load training.';

    // Mock the methods of the service
    mockTrainingService.fetchToken.and.returnValue(of(mockToken));
    mockTrainingService.getTraining.and.returnValue(throwError('Failed to fetch data'));

    // Call the fetchArticles method
    component.fetchArticles();

    // Assert that the error message is set
    expect(component.articles).toEqual([]);
    expect(component.loading).toBeFalse();
    expect(component.error).toBe(mockErrorMessage);
  });

  it('should set error message when token is not fetched', () => {
    // Mock the methods of the service
    mockTrainingService.fetchToken.and.returnValue(throwError('Failed to fetch token'));

    // Call the fetchArticles method
    component.fetchArticles();

    // Assert that the error message is set
    expect(component.articles).toEqual([]);
    expect(component.loading).toBeFalse();
    expect(component.error).toBe('Failed to retrieve a valid token.');
  });

  it('should fetch images and update images array', () => {
    const mockTrainingData = [{ id: 1, field_learning_path_media_image: [{ target_uuid: 'uuid-1' }], metatag: { value: { title: 'Test Title' } } }];
    const mockImageUrl = { data: { attributes: { uri: { url: 'image-url' } } } };

    // Mock the methods of the service
    mockTrainingService.getImageUrl.and.returnValue(of(mockImageUrl));

    // Call the fetchImages method
    component.fetchImages(mockTrainingData);

    // Assert that the images array is populated
    expect(component.images.length).toBe(1);
    expect(component.images[0]).toBe('image-url');
  });
});
