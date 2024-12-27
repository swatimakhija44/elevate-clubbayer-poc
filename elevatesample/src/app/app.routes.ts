import { Routes } from '@angular/router';
import { loadRemoteModule } from '@angular-architects/module-federation';



export const routes: Routes = [
    {
      path: 'news',
  
      loadChildren: () =>
        loadRemoteModule({
          type: 'manifest',
          remoteName: 'my-angular-app',
          exposedModule: './routes',
        }).then((r:any) => {
          console.log("Remote module loaded:", r);
          console.log("Routes from remote module:", r.routes);
          return r.routes;  // Make sure to return the routes
        })
        .catch((error:any) => {
          console.error("Error loading remote module:", error);
        }),

    }
  
];
