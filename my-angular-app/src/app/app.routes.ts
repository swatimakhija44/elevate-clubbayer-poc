import { Routes } from '@angular/router';
import { NewsComponent } from './news/news.component';
import { MenuComponent } from './menu/menu.component';

export const routes: Routes = [
 
  {
    path: 'news',
    component: NewsComponent
    // loadComponent: () =>
    //   import('./news/news.component').then((m) => m.NewsComponent),
  },
  {
    path: 'menu',
    component: MenuComponent
  },

];