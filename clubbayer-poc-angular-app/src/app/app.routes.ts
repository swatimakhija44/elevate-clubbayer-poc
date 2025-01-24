import { Routes } from '@angular/router';
import { NewsComponent } from './news/news.component';
import { HeaderComponent } from './header/header.component';

export const routes: Routes = [
 
  {
    path: 'news',
    component: NewsComponent
    // loadComponent: () =>
    //   import('./news/news.component').then((m) => m.NewsComponent),
  },
  {
    path: '',
    component: HeaderComponent
  },

];