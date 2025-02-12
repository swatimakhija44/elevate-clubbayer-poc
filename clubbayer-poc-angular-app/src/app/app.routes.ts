import { Routes } from '@angular/router';
import { NewsComponent } from './news/news.component';
import { TrainingComponent } from './training/training.component';
import { MenuComponent } from './menu/menu.component';
import { TrainingDetailComponent } from './training-detail/training-detail.component';

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
    component: TrainingComponent,
    data: { 
      title: 'My training sub-category carousel | Club Bayer', 
      skipParentTitle: true 
    }
  },
  // {
  //   path: 'training-detail/:id',
  //   component: TrainingDetailComponent,
    
  // },
  {
    path: 'group/:id',
    component: TrainingDetailComponent,
    
  },
  {
    path: '**',
    redirectTo: 'news',
    pathMatch: 'full',
  },

];
