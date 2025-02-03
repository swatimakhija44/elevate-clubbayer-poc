import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrainingComponent } from './training.component';
import { TrainingService } from './training.service';
import { HttpClientModule } from '@angular/common/http';
import { of, throwError } from 'rxjs';
import { environment } from '../../environments/environments';

describe('TrainingComponent', () => {
  let component: TrainingComponent;
    let fixture: ComponentFixture<TrainingComponent>;
    let mocktrainService: jasmine.SpyObj<TrainingService>;
  
    beforeEach(() => {
      // Create a spy for the trainService
      mocktrainService = jasmine.createSpyObj('trainService', ['fetchToken', 'gettrain', 'getImageUrl']);
  
      // Set up the TestBed
      TestBed.configureTestingModule({
        imports: [HttpClientModule, TrainingComponent],
        providers: [
          { provide: TrainingService, useValue: mocktrainService },
        ],
      });
  
      fixture = TestBed.createComponent(TrainingComponent);
      component = fixture.componentInstance;
    });
  
    it('should create the component', () => {
      expect(component).toBeTruthy();
    });
  
    it('should load articles successfully', () => {
      const mockToken = 'fake-token';
      const mocktrainData = {
        data: [{ attributes: { title: 'Article 1', body: 'Content' } }],
      };
  
  
      mocktrainService.fetchToken.and.returnValue(of(mockToken));
  
      mocktrainService.getTraining.and.returnValue(of(mocktrainData));
  
  
      component.ngOnInit();
      fixture.detectChanges();
  
  
      expect(component.articles.length).toBe(1);
      expect(component.articles[0].attributes.title).toBe('Article 1');
      expect(component.loading).toBeFalse();
    });
  
    it('should handle error when fetching token fails', () => {
  
      mocktrainService.fetchToken.and.returnValue(throwError('Token error'));
  
      component.ngOnInit();
      fixture.detectChanges();
  
  
      expect(component.loading).toBeFalse();
      expect(component.error).toBe('Failed to retrieve a valid token.');
    });
  
    it('should handle error when fetching train fails', () => {
      const mockToken = 'fake-token';
  
  
      mocktrainService.fetchToken.and.returnValue(of(mockToken));
  
      mocktrainService.getTraining.and.returnValue(throwError('train fetching error'));
  
      component.ngOnInit();
      fixture.detectChanges();
  
  
      expect(component.loading).toBeFalse();
      
    });
  
  //   it('should fetch images for articles', () => {
  //     const mockToken = '133';
  //     const mocktrainData = {
  //       data: [
  //         {
  //           relationships: { field_train_image: { data: { id: 'image-id' } } },
  //           attributes: { title: 'Article 1', body: 'Content' },
  //         },
  //       ],
  //     };
  
  //     const mockImageData = {
  //       data: { attributes: { uri: { url: `${environment.DRUPAL_BASE_URL}/jsonapi/file/mime_attachment_binary` } } },
  //     };
  
  
  //     mocktrainService.fetchToken.and.returnValue(of(mockToken));
  
  //     mocktrainService.getTraining.and.returnValue(of(mocktrainData));
  
  //     // mocktrainService.getImageUrl.and.returnValue(of(mockImageData));
  
  //     component.ngOnInit();
  //     fixture.detectChanges();
  
  
  //     expect(component.images.length).toBe(1);
  //     expect(component.images[0]).toBe(`${environment.DRUPAL_BASE_URL}/jsonapi/file/mime_attachment_binary`);
  //   });
  
  //   it('should handle error when fetching image fails', () => {
  //     const mockToken = 'fake-token';
  //     const mocktrainData = {
  //       data: [
  //         {
  //           relationships: { field_train_image: { data: { id: 'image-id' } } },
  //           attributes: { title: 'Article 1', body: 'Content' },
  //         },
  //       ],
  //     };
  
  
  //     mocktrainService.fetchToken.and.returnValue(of(mockToken));
  
  //     mocktrainService.gettrain.and.returnValue(of(mocktrainData));
  
  //     mocktrainService.getImageUrl.and.returnValue(throwError('Image loading error'));
  
  //     component.ngOnInit();
  //     fixture.detectChanges();
  
  
  //     expect(component.images.length).toBe(1);
  //     expect(component.error).toBeNull();
  //   });
   });
  