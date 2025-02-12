import { Component } from '@angular/core';
import { TrainingService } from './training.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-training',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './training.component.html',
  styleUrl: './training.component.css'
})
export class TrainingComponent {
articles: any[] = [];
  source: any[] = [];
  loading = true;
  images: string[] = [];
  error: string | null = null;

  constructor(private trainingService: TrainingService) {}

  ngOnInit() {
    this.fetchArticles();
    
  }

  
  // Updated fetchArticles method using the new fetchCachedToken
  fetchArticles(): void {
    this.trainingService.fetchToken().subscribe(
      (token) => {
        if (token) {
          // Now we get the training using the cached or new token
          this.trainingService.getTraining().subscribe(
            (trainData) => {
              console.log("data", trainData)
              this.articles = trainData || [];
              
              this.loading = false;
              this.fetchImages(this.articles);
              // this.fetchGroupLink(this.articles)
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

   // Fetch images for the articles
  fetchImages(trainingItems: any[]): void {
    const imageIds = trainingItems.map((item) => item.field_learning_path_media_image[0]?.target_uuid);
    this.images = [];
    const metatitle = trainingItems.forEach((item) =>item.metatag.value.title)
    this.trainingService.updateTitle(metatitle);
    imageIds.forEach((id, index) => {
      if (id) {
        this.trainingService.getImageUrl(id).subscribe(
          (response) => {
            this.images[index] = response?.data?.attributes?.uri?.url || '';
          },
          (error) => {
            console.error('Failed to load image', error);
            this.images[index] = ''; // Handle failed image loading gracefully
          }
        );
      }
    });
  }

  // fetchGroupLink(trainingItems: any[]): void {
  //   const trainingIds = trainingItems.map((item) =>item.id[0].value);
  //   this.gplink = [];
  //   trainingIds.forEach((id, index) => {
  //     if (id) {
  //       this.gplink[index] = trainingIds;
  //       console.log(this.gplink[index])
  //     }
  //   });
  // }
}
