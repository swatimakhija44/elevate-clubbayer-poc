import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FooterService } from '../service/footer.service';

@Component({
  selector: 'app-clubbayerfooter',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './clubbayerfooter.component.html',
  styleUrls: ['./clubbayerfooter.component.css'],
})
export class ClubbayerfooterComponent implements OnInit {
  footerMenuItem: any[] = [];
  footerMainenuItem: any[] = [];
  footerBlockItem: any[] = [];
  loading = true;
  error: string | null = null;
  articles: any;

  constructor(private footerService: FooterService) {}

  ngOnInit() {
    this.fetchFooterMenu();
  }

  fetchFooterMenu(): void {
    this.footerService.fetchToken().subscribe(
      (token) => {
        if (token) {
          this.footerService.getFooterMenuItems().subscribe(
            (footerOneData: any[]) => {
              this.footerMenuItem = Array.isArray(footerOneData)
                ? footerOneData.map(
                    (item: { title: string; below?: { title: string }[] }) => ({
                      title: item.title,
                      belowTitles: Array.isArray(item.below)
                        ? item.below.map((subItem) => subItem.title)
                        : [],
                    })
                  )
                : [];

              this.loading = false;
            },
            (error) => {
              console.error('Error fetching footer menu:', error);
              this.loading = false;
              this.error = error?.message ?? 'Failed to load footer data.';
            }
          );
          this.footerService.getFooterPreMenu().subscribe(
            (footerTwoData: any[]) => {
              this.footerMainenuItem = Array.isArray(footerTwoData)
                ? footerTwoData.map((item: { title: string }) => ({
                    mainTitle: item.title,
                  }))
                : [];

              this.loading = false;
            },
            (error) => {
              console.error('Error fetching footer menu:', error);
              this.loading = false;
              this.error = error?.message ?? 'Failed to load footer data.';
            }
          );

          this.footerService.getFooterBlockContent().subscribe(
            (footerThreeData: any) => {
              if (
                footerThreeData &&
                footerThreeData.data &&
                footerThreeData.data.attributes &&
                footerThreeData.data.attributes.body &&
                footerThreeData.data.attributes.body.value
              ) {
                const blockContent = footerThreeData.data.attributes.body.value;

                // Strip HTML tags using a regular expression
                const strippedContent = blockContent
                  .replace(/<\/?[^>]+(>|$)/g, '')
                  .replace(/&nbsp;/g, ' ');

                this.footerBlockItem = [{ blockContent: strippedContent }];
              } else {
                console.error(
                  'Unexpected structure in footerThreeData:',
                  footerThreeData
                );
                this.footerBlockItem = [{ mainTitle: '' }];
              }
            },
            (error) => {
              console.error('Error fetching footer menu:', error);
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
        console.error('Error fetching token:', error);
        this.loading = false;
        this.error = 'Failed to retrieve a valid token.';
      }
    );
  }
}
