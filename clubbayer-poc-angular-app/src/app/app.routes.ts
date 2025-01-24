import { Routes } from '@angular/router';
import { NewsComponent } from './news/news.component';

export const routes: Routes = [
 
  {
    path: '',
    component: NewsComponent
    // loadComponent: () =>
    //   import('./news/news.component').then((m) => m.NewsComponent),
  },

];