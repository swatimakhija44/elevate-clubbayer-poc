import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FooterService } from '../service/footer.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css'],
})

export class FooterComponent implements OnInit {
  footerMenuItem: any[] = [];
  footerMainMenuItem: any[] = [];
  footerBlockItem: any[] = [];
  loading = true;
  error: string | null = null;

  constructor(private footerService: FooterService) { }

  ngOnInit() {
    this.fetchFooterData();
  }

  private fetchFooterData(): void {
    this.footerService.fetchToken().subscribe(
      (token) => {
        if (!token) {
          this.handleError('Failed to retrieve a valid token.');
          return;
        }

        forkJoin({
          menuItems: this.footerService.getFooterMenuItems(),
          preMenuItems: this.footerService.getFooterPreMenu(),
          blockContent: this.footerService.getFooterBlockContent(),
        }).subscribe(
          ({ menuItems, preMenuItems, blockContent }) => {
            this.footerMenuItem = this.transformMenuItems(menuItems);
            this.footerMainMenuItem = this.transformPreMenuItems(preMenuItems);
            this.footerBlockItem = this.extractBlockContent(blockContent);
            this.loading = false;
          },
          (error) => this.handleError(error?.message ?? 'Failed to load footer data.')
        );
      },
      (error) => this.handleError('Failed to retrieve a valid token.')
    );
  }

  private transformMenuItems(data: any[]): any[] {
    return Array.isArray(data)
      ? data.map(item => ({
        title: item.title,
        belowTitles: item.below?.map((subItem: { title: any; }) => subItem.title) ?? [],
      }))
      : [];
  }

  private transformPreMenuItems(data: any[]): any[] {
    return Array.isArray(data) ? data.map(item => ({ mainTitle: item.title })) : [];
  }

  private extractBlockContent(data: any): any[] {
    if (
      data?.data?.attributes?.body?.value
    ) {
      const content = data.data.attributes.body.value;
      return [{ blockContent: content.replace(/<\/?[^>]+(>|$)/g, '').replace(/&nbsp;/g, ' ') }];
    }
    console.error('Unexpected structure in footer block content:', data);
    return [{ blockContent: '' }];
  }

  private handleError(message: string): void {
    console.error(message);
    this.loading = false;
    this.error = message;
  }
}
