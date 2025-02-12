import { loadRemoteModule } from '@angular-architects/module-federation';
import { Component, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
 
@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css'
})
export class FooterComponent implements OnInit {
 
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
 
    this.viewContainer.createComponent(m.ClubbayerfooterComponent);
  }
}