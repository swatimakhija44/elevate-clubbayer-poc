import { loadRemoteModule } from '@angular-architects/module-federation';
import { Component, ViewChild, ViewContainerRef } from '@angular/core';

@Component({
  selector: 'app-cb-footer',
  standalone: true,
  imports: [],
  templateUrl: './cb-footer.component.html',
  styleUrl: './cb-footer.component.css'
})
export class CbFooterComponent {
  @ViewChild('footer', { read: ViewContainerRef })
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
      exposedModule: './footer',
    });

    this.viewContainer.createComponent(m.FooterComponent);
  }
}
