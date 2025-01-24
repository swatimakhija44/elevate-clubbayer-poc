import { Component, Input, OnInit } from '@angular/core';
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
  @Input() menuItems: MenuItem[] = [];
  flatMenuItems: MenuItem[] = [];
  menu: MenuItem[] = [];
  loading = true;

  constructor(private menuService: MenuService) { }

  ngOnInit(): void {
    this.getMenuData();
  }

  getMenuData(): void {
    this.menuService.fetchToken().subscribe((tokenData) => {
      if (tokenData && tokenData.access_token) {
        this.menuService.getMenu(tokenData.access_token).subscribe((menuData) => {
          this.menu = menuData || [];
          this.processMenuItems();
          this.loading = false;
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
      this.flatMenuItems.push(item);
    });
  }
}




