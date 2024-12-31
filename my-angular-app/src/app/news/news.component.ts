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
  images: string[] = [];
  loading: boolean = true;
  error: string | null = null;

  constructor(private newsService: NewsService) {}

  ngOnInit() {
    this.fetchArticles();
  }

  fetchArticles() {
    this.newsService.getNews().subscribe(
      (data) => {
        this.articles = data?.data || [];
        this.loading = false;
        this.fetchImages(); // Fetch images once articles are loaded
      },
      (error) => {
        this.error = 'Failed to load articles';
        this.loading = false;
      }
    );
  }

  // Fetch images for each article
  fetchImages() {
    const imageIds = this.articles.map((item) => item.relationships?.field_news_image?.data?.id);

    // Fetch image URLs asynchronously for each image ID
    this.images = [];
    imageIds.forEach((id, index) => {
      this.newsService.getImageUrl(id).subscribe(
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
