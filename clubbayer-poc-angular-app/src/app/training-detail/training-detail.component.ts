import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TrainingDetailService } from './training-detail.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-training-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './training-detail.component.html',
  styleUrl: './training-detail.component.css'
})
export class TrainingDetailComponent {
  trainingdetail: any = {};
  source: any[] = [];
  loading = true;
  trainingId: number | undefined;
  error: string | null = null;
  images: any[] = [];
  constructor(private trainingService: TrainingDetailService, private route: ActivatedRoute,) {}

  ngOnInit() {
    const routeSnapshot = this.route.snapshot;
  if (routeSnapshot && routeSnapshot.paramMap) {
    this.trainingId = +routeSnapshot.paramMap.get('id')!;
    this.fetchTrainingDetail(this.trainingId);
  } 
   
    
  }

  
  // Updated fetchArticles method using the new fetchCachedToken
  fetchTrainingDetail(id:any): void {
    this.trainingService.fetchToken().subscribe(
      (token) => {
        if (token) {
          // Now we get the training using the cached or new token
          this.trainingService.getTraining(id).subscribe(
            (trainData) => {
              
              this.trainingdetail = trainData || {};
              console.log("data", this.trainingdetail)
              this.loading = false;
              this.images = trainData.field_learning_path_media_image[0].target_uuid; // Assuming the API response structure
              console.log('Fetched Images:', this.images);
              this.trainingService.getImageUrl(this.images).subscribe(
                (response:any) => {
                  console.log('Image Details:', response); 
                  this.images = response?.data?.attributes?.uri?.url || '';

                })
            },
            (error) => {
              console.error('Error fetching training:', error);
              this.loading = false;
              this.error = 'Failed to load training.';
            }
          );
        } else {
          this.loading = false;
          this.error = 'Failed to retrieve a valid token.';
        }
      },
      (error) => {
        console.error('Error fetching token:', error);
        this.loading = false;
        this.error = 'Failed to retrieve a valid token.';
      }
    );
  }
  // fetchImages(trainingItems: any[]): void {
  //   const aa = trainingItems
  //   this.images = [];
 
  //       this.trainingService.getImageUrl(trainingItems).subscribe(
  //         (response:any) => {
  //           this.images = response.field_learning_path_media_image; // Assuming the API response structure
  //     console.log('Fetched Images:', this.images);
  //           // this.images = response?.data?.attributes?.uri?.url || '';
            
  //         },
  //         (error) => {
  //           console.error('Failed to load image', error);
         
  //         }
  //       );
  //     }

 
}
