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
  // images: string[] = [];
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
          // Now we get the news using the cached or new token
          this.trainingService.getTraining().subscribe(
            (trainData) => {
              console.log("data", trainData)
              this.articles = trainData?.data || [];
              this.loading = false;
              // this.fetchImages(this.articles, token);
            },
            (error) => {
              console.error('Error fetching news:', error);
              this.loading = false;
              this.error = 'Failed to load news.';
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

  // // Fetch images for the articles
  // fetchImages(newsItems: any[], token: string): void {
  //   const imageIds = newsItems.map((item) => item.relationships?.field_news_image?.data?.id);
  //   this.images = [];

  //   imageIds.forEach((id, index) => {
  //     if (id) {
  //       this.newsService.getImageUrl(id).subscribe(
  //         (response) => {
  //           this.images[index] = response?.data?.attributes?.uri?.url || '';
  //         },
  //         (error) => {
  //           console.error('Failed to load image', error);
  //           this.images[index] = ''; // Handle failed image loading gracefully
  //         }
  //       );
  //     }
  //   });
  // }
}
