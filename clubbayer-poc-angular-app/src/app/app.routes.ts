import { Routes } from '@angular/router';
import { NewsComponent } from './news/news.component';
// import { HeaderComponent } from './header/header.component';

export const routes: Routes = [
  {
    path: 'news',
    component: NewsComponent
  },
  {
    path: '**',
    redirectTo: 'news',
    pathMatch: 'full',
  }
  // {
  //   path: '',
  //   component: HeaderComponent
  // }
];
