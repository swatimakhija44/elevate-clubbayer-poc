import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NewsService } from '../news.service';
 
@Component({
  selector: 'app-news',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './news.component.html',
  styleUrl: './news.component.css',
})
export class NewsComponent implements OnInit {
  articles: any[] = [];
  source: any[] =[];
  loading = true;
  images: string[] = [];
  error: string | null = null;
  
 
  constructor(private newsService: NewsService) {}
 
  ngOnInit() {
    this.fetchArticles();
  }
 
  fetchArticles(): void {
    this.newsService.fetchToken().subscribe((tokenData) => {
        if (tokenData && tokenData.access_token) {
          this.newsService.getNews(tokenData.access_token).subscribe((newsData) => {
              this.articles = newsData?.data || [];
              // console.log('news', this.articles)
              this.loading = false;
              this.fetchImages(this.articles, tokenData.access_token);
            },
            (error) => {
              console.error('Error fetching news:', error);
              this.loading = false;
            }
          );
        } else {
          this.loading = false;
        }
      },
      (error) => {
        console.error('Error fetching token:', error);
        this.loading = false;
      }
    );
  }
 
  
  fetchImages(newsItems: any[], token: string): void {
    const imageIds = this.articles.map((item) => item.relationships?.field_news_image?.data?.id);
    this.images = [];
    imageIds.forEach((id, index) => {
      this.newsService.getImageUrl(id,token).subscribe(
        (response) => {
          this.images[index] = response?.data?.attributes?.uri?.url || '';
        },
        (error) => {
          console.error('Failed to load image', error);
        }
      );
    });
  }
}