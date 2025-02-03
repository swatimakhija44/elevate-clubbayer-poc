import { Routes } from '@angular/router';
import { loadRemoteModule } from '@angular-architects/module-federation';



export const routes: Routes = [
  {
    path:"club-bayer",
    loadChildren: () =>
      loadRemoteModule({
        type: 'manifest',
          remoteName: 'my-angular-app',
        exposedModule: './routes',
      }).then((r:any) => {
        return r.routes; 
      })
      .catch((error:any) => {
        console.error("Error loading remote module:", error);
      }),
  } ,
    {
      path: 'iframe',
      loadComponent: () => import('./iframe/iframe.component').then(m => m.IframeComponent)
    }
];
