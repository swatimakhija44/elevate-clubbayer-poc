import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RouterModule } from '@angular/router';
import { MenuItem } from './menu-item.model';
import { MenuService } from '../service/menu.service';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.css'
})
export class MenuComponent implements OnInit {
  flatMenuItems: MenuItem[] = [];
  menu: MenuItem[] = [];
  loading = true;
  error: string | null = null;

  constructor(private menuService: MenuService) { }

  ngOnInit() {
    this.getMenuData();
  }

  // fetching menu items using the token
  getMenuData(): void {
    this.menuService.fetchToken().subscribe((tokenData) => {
      if (tokenData) {
        this.menuService.getMenu(tokenData).subscribe((menuData) => {
          this.menu = menuData || [];

          this.processMenuItems(); //Calling the filtered menu items
          this.loading = false;
        },
          (error) => {
            console.error('Error fetching menu:', error);
            this.loading = false;
            this.error = 'Failed to load menu.';
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

  //Filtering the enbaled menu items 
  processMenuItems(): void {
    this.menu.filter(item => item.enabled === true).map(item => {
      const { below, ...rest } = item;
      if (below?.length) {
        const filteredItem = below.filter(subItem => subItem.enabled === true);
        item = {
          ...rest,
          below: filteredItem
        };
      }
      this.flatMenuItems?.push(item);
    });
  }
}