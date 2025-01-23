import { AfterViewInit, Component, ElementRef, Input, OnInit, QueryList, Renderer2, ViewChildren } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MenuItem } from './menu-item.model';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [CommonModule,RouterModule],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.css'
})
export class MenuComponent implements OnInit,AfterViewInit {
  @Input() menuItems: MenuItem[] = [];
  @ViewChildren('menuLink') menuLinks!: QueryList<ElementRef>;
  flatMenuItems: MenuItem[] = [];

  constructor(private renderer: Renderer2, private router: Router,private route:ActivatedRoute) { }

  ngOnInit(): void {
    this.setMenuItems();
    this.flattenMenuItems();
  }
  ngAfterViewInit(): void {
    this.menuLinks.forEach((link, index) => {
      const menuItem = this.flatMenuItems[index];
      this.renderer.setProperty(link.nativeElement, 'textContent', menuItem.title);
      this.renderer.setAttribute(link.nativeElement, 'href', menuItem.absolute?? '#');
    });
  }

  setMenuItems(): void {
    this.menuItems =[
      {
        "key": "87d63017-68ec-44ee-b72d-a99ec74a1603",
        "title": "Learn",
        "enabled": true,
        "below": [
          {
            "key": "879bde9a-93a0-441e-be60-467274135190",
            "title": "Learning Paths",
            "absolute": "https://chhcpportalode4.prod.acquia-sites.com//manual-learning-paths",
            "enabled": true,
          },
          {
            "key": "77c86300-d28d-4f66-98e9-a743ee1d5df3",
            "title": "Health Trainings",
            "absolute": "https://club.bayer.ae/my-training?tagParent=health",
            "enabled": true,
          },
          {
            "key": "ae5c7e0c-6e97-43d8-b14c-a662052ab99f",
            "title": "Business Trainings",
            "absolute": "https://club.bayer.ae/my-training?tagParent=business",
            "enabled": true,
          },
          {
            "key": "6e0a24f7-ae18-4896-bce0-3cc6e243f339",
            "title": "Webinars",
            "absolute": "https://chhcpportalode4.prod.acquia-sites.com//my-webinars",
            "enabled": true,
          }
        ],
      },
      {
        "key": "e6174a86-5bdf-4b62-a176-ac6c4476fe1f",
        "title": "My Challenges",
        "absolute": "https://chhcpportalode4.prod.acquia-sites.com//my-challenges",
        "enabled": true,
      },
      {
        "key": "cffa83a4-3c17-45d0-96a4-bd0cb86b79b3",
        "title": "Rewards",
        "enabled": true,
        "below": [
          {
            "key": "baf7ca0f-c8f8-429c-aa64-9bedf02997d3",
            "title": "My medals",
            "absolute": "https://chhcpportalode4.prod.acquia-sites.com//user/my-medals",
            "enabled": true,
          }
        ]
      },
      {
        "key": "1d03c055-906e-44f6-aeb4-ce718163a35b",
        "title": "Explore",
        "enabled": true,
        "below": [
          {
            "key": "84894b2b-606e-48a1-afde-eac8e7f42672",
            "title": "What is CB?",
            "absolute": "https://chhcpportalode4.prod.acquia-sites.com//what-is-club-bayer",
            "enabled": true,
          }
        ]
      }
    ]
  }

  private flattenMenuItems(): void {
    this.flatMenuItems = [];
    this.menuItems.forEach(item => {
      this.flatMenuItems.push(item);
      if (item.below) {
        this.flatMenuItems.push(...item.below);
      }
    });

    console.log("Items",this.flatMenuItems);
  
  }
}