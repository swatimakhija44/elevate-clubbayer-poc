import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FooterService } from '../service/footer.service';

@Component({
  selector: 'app-clubbayerfooter',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './clubbayerfooter.component.html',
  styleUrls: ['./clubbayerfooter.component.css']
})
export class ClubbayerfooterComponent implements OnInit {

  footerMenuItem: any[] = [];
  footerMainenuItem: any[] = [];
  loading = true;
  error: string | null = null;

  constructor(private footerService: FooterService) { }

  ngOnInit() {
    this.fetchFooterMenu();
  }

  fetchFooterMenu(): void {
    this.footerService.fetchToken().subscribe(
      (token) => {
        if (token) {
          this.footerService.getFooterOne().subscribe(
            (footerOneData: any[]) => {
              this.footerMenuItem = Array.isArray(footerOneData)
                ? footerOneData.map((item: { title: string; below?: { title: string }[] }) => ({
                  title: item.title,
                  belowTitles: Array.isArray(item.below)
                    ? item.below.map(subItem => subItem.title)
                    : []
                }))
                : [];

              this.loading = false;
            },
            (error) => {
              console.error("Error fetching footer menu:", error);
              this.loading = false;
              this.error = error?.message ?? 'Failed to load footer data.';
            }
          );
          this.footerService.getFooterTwo().subscribe(
            (footerTwoData: any[]) => {
              this.footerMainenuItem = Array.isArray(footerTwoData)
                ? footerTwoData.map((item: { title: string }) => ({
                  mainTitle: item.title
                }))
                : [];

              this.loading = false;
            },
            (error) => {
              console.error("Error fetching footer menu:", error);
              this.loading = false;
              this.error = error?.message ?? 'Failed to load footer data.';
            }
          );
        } else {
          this.loading = false;
          this.error = 'Failed to retrieve a valid token.';
        }
      },
      (error) => {
        console.error("Error fetching token:", error);
        this.loading = false;
        this.error = 'Failed to retrieve a valid token.';
      }
    );
  }
}