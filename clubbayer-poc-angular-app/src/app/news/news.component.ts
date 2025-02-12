import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NewsService } from '../news.service';

@Component({
  selector: 'app-news',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.css'],
})
export class NewsComponent implements OnInit {
  articles: any[] = [];
  source: any[] = [];
  loading = true;
  images: string[] = [];
  error: string | null = null;

  constructor(private newsService: NewsService) { }

  ngOnInit() {
    this.fetchArticles();
  }

  // Updated fetchArticles method using the new fetchCachedToken
  fetchArticles(): void {
    this.newsService.fetchToken().subscribe(
      (token) => {
        if (token) {
          // Now we get the news using the cached or new token
          this.newsService.getNews().subscribe(
            (newsData) => {
              this.articles = newsData?.data || [];
              this.loading = false;
              this.fetchImages(this.articles);
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

  // Fetch images for the articles
  fetchImages(newsItems: any[]): void {
    const imageIds = newsItems.map((item) => item.relationships?.field_news_image?.data?.id);
    this.images = [];

    imageIds.forEach((id, index) => {
      if (id) {
        this.newsService.getImageUrl(id).subscribe(
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
}
