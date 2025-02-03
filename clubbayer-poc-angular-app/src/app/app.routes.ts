import { Routes } from '@angular/router';
import { NewsComponent } from './news/news.component';
import { TrainingComponent } from './training/training.component';
import { MenuComponent } from './menu/menu.component';

export const routes: Routes = [

  {
    path:'menu',
    component:MenuComponent
  },
  {
    path: 'news',
    component: NewsComponent
  },
  {
    path: 'training',
    component: TrainingComponent
  },
  {
    path: '**',
    redirectTo: 'news',
    pathMatch: 'full',
  }
];
