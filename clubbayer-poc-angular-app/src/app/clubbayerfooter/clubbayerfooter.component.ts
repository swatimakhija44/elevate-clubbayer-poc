import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FooterService } from '../service/footer.service';

@Component({
  selector: 'app-clubbayerfooter',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './clubbayerfooter.component.html',
  styleUrl: './clubbayerfooter.component.css'
})
export class ClubbayerfooterComponent implements OnInit {

  footerMenuItem: any[] = [];
  footerSubmenuItem: any[] = [];
  source: any[] = [];
  loading = true;
  images: string[] = [];
  error: string | null = null;

  constructor(private footerService: FooterService) { }

  ngOnInit() {
    this.fetchFooterMenu();
  }

  // Updated fetchArticles method using the new fetchCachedToken
  fetchFooterMenu(): void {

    this.footerService.fetchToken().subscribe(
      (token) => {
        if (token) {
          console.log("aaaaaaaaaaaaaaaa1");

          // Now we get the news using the cached or new token
          this.footerService.getFooterOne().subscribe(
            (footerOneData: any[]) => {
              this.footerMenuItem = footerOneData?.map((item: { title: string; below?: { title: string }[] }) => ({
                title: item.title,
                belowTitles: item.below?.map(subItem => subItem.title) ?? []
              })) ?? [];
              this.loading = false;
              // this.fetchImages(this.articles, token);
              console.log("aaaaaaaaaaaaaaaa", footerOneData);
              console.log("aaaaaaaaaaaaaaaa1111111", footerOneData[0].title);
              console.log("aaaaaaaaabbbbb", this.footerMenuItem);
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
}

