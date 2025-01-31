import { Routes } from '@angular/router';
import { NewsComponent } from './news/news.component';
import { MenuComponent } from './menu/menu.component';
import { TestComponent } from './test/test.component';

export const routes: Routes = [
  {
    path: 'menu',
    component:MenuComponent
  },
  {
    path: 'news',
    component: NewsComponent
  },
  {
    path: 'test',
    component: TestComponent
  },
  {
    path: '**',
    redirectTo: 'news',
    pathMatch: 'full',
  },
  
];
