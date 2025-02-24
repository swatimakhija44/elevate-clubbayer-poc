import { loadRemoteModule } from '@angular-architects/module-federation';
import { Component, ViewChild, ViewContainerRef } from '@angular/core';

@Component({
  selector: 'app-cb-header',
  standalone: true,
  imports: [],
  templateUrl: './cb-header.component.html',
  styleUrl: './cb-header.component.css'
})
export class CbHeaderComponent {
  @ViewChild('header', { read: ViewContainerRef })
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
      exposedModule: './header',
    });

    this.viewContainer.createComponent(m.CbHeaderComponent);
  }
}
