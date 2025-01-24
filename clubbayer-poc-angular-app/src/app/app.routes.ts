import { Routes } from '@angular/router';
import { NewsComponent } from './news/news.component';
import { HeaderComponent } from './header/header.component';

export const routes: Routes = [
  {
    path: '',
    path: 'news',
    component: NewsComponent
  },
  {
    path: '',
    component: HeaderComponent
  }
];
