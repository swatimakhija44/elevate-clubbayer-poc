import { loadRemoteModule } from '@angular-architects/module-federation';
import { Component, OnInit, ViewChild, ViewContainerRef } from '@angular/core';

@Component({
  selector: 'app-cb-menu',
  standalone: true,
  imports: [],
  templateUrl: './cb-menu.component.html',
  styleUrl: './cb-menu.component.css'
})
export class CbMenuComponent implements OnInit {

  @ViewChild('menu', { read: ViewContainerRef })
  viewContainer!: ViewContainerRef;

  constructor() { }

  ngOnInit(): void {
    this.load();
  }

  async load(): Promise<void> {
    // Dynamically load the remote module and expose the component.
    const m = await loadRemoteModule({
      type: 'manifest',
      remoteName: 'clubbayer-poc-angular-app',
      exposedModule: './menu',
    });

    this.viewContainer.createComponent(m.MenuComponent);
  }
}
