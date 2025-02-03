import { TestBed } from '@angular/core/testing';

import { TrainingService } from './training.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TrainingComponent } from './training.component';
import { environment } from '../../environments/environments';
import { of } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

describe('TrainingService', () => {
  let component: TrainingComponent;
   let service: TrainingService;
   let httpMock: HttpTestingController;
 
   const mockToken = 'fake-token';
   const mocktrainData = { data: [{ attributes: { title: 'Article 1' } }] };
   const mockImageData = { url: `${environment.DRUPAL_BASE_URL}/file/mime_attachment_binary` };
 
   beforeEach(() => {
     TestBed.configureTestingModule({
       imports: [HttpClientTestingModule, TrainingComponent],
       providers: [TrainingService],
     });
     service = TestBed.inject(TrainingService);
     httpMock = TestBed.inject(HttpTestingController);
 
     component = TestBed.createComponent(TrainingComponent).componentInstance;
     service = TestBed.inject(TrainingService);
   });
 
   afterEach(() => {
     httpMock.verify();
   });
   it('should create the component', () => {
     expect(component).toBeTruthy();
   });
   it('should return cached token if available and valid', () => {
     service['TOKEN_CACHE'] = { accessToken: mockToken, expiresAt: Date.now() + 10000 };
 
     service.fetchToken().subscribe((token) => {
       expect(token).toBe(mockToken);
     });
   });
 
   it('should fetch a new token if not cached or expired', () => {
 
     service['TOKEN_CACHE'] = { accessToken: null, expiresAt: null };
 
 
     const mockToken = '123';
     const mockTokenResponse = { access_token: mockToken, expires_in: 3600 };
 
     service.fetchToken().subscribe((token) => {
       expect(token).toBe(mockToken); 
     });
     const expectedUrl = `${environment.DRUPAL_BASE_URL}/oauth/token`;
     const req = httpMock.expectOne(expectedUrl);
 
     expect(req.request.method).toBe('POST');
 
     req.flush(mockTokenResponse);
     httpMock.verify();
   });
 
 
   it('should get train after fetching the token', () => {
     spyOn(service, 'fetchToken').and.returnValue(of(mockToken));
 
     service.getTraining().subscribe((train) => {
       expect(train).toEqual(mocktrainData);
     });
 
     const expectedUrl = `${environment.DRUPAL_BASE_URL}/jsonapi/views/baych_ahcp_my_training_page/page`;
     const req = httpMock.expectOne(expectedUrl);
     expect(req.request.method).toBe('GET');
     req.flush(mocktrainData);
   });
 
   it('should handle error when fetching train fails', () => {
     service.getTraining().subscribe({
       next: () => fail('should have failed with an error'),
       error: (error: HttpErrorResponse) => {
         expect(error.status).toBe(500);
         expect(error.error.message).toBe('Internal Server Error');  
       }
     });
 
     const expectedUrl = `${environment.DRUPAL_BASE_URL}/oauth/token`;
     httpMock.expectOne(expectedUrl);
 
   });
 
 
  //  it('should fetch image URL after fetching the token', () => {
  //    const mockImageId = '123';
  //    spyOn(service, 'fetchToken').and.returnValue(of('fake-token'));
  //    service.getImageUrl(mockImageId).subscribe((image) => {
  //      expect(image).toEqual(mockImageData);  
  //    });
 
  //    const expectedUrl = `${environment.DRUPAL_BASE_URL}/jsonapi/file/mime_attachment_binary/${mockImageId}`;
 
  //    const req = httpMock.expectOne(expectedUrl);
  //    expect(req.request.method).toBe('GET');
  //    req.flush(mockImageData);
  //    httpMock.verify();
  //  });
 
 
  //  it('should handle error when fetching image URL fails', () => {
  //    const mockImageId = '123';
  //    const mockError = { message: 'Image not found' };
  //    spyOn(service, 'fetchToken').and.returnValue(of('fake-token'));
 
  //    service.getImageUrl(mockImageId).subscribe(
  //      () => fail('should have failed with an error'),
  //      (error) => {
  //        expect(error.status).toBe(404);
  //        expect(error.error.message).toBe('Image not found');
  //      }
  //    );
  //    const expectedUrl = `${environment.DRUPAL_BASE_URL}/jsonapi/file/mime_attachment_binary/${mockImageId}`;
  //    const req = httpMock.expectOne(expectedUrl);
  //    expect(req.request.method).toBe('GET');
  //    req.flush(mockError, { status: 404, statusText: 'Not Found' });
  //    httpMock.verify();
  //  });
 });