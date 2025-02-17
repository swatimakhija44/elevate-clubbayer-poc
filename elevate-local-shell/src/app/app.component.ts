import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CbMenuComponent } from './cb-menu/cb-menu.component';
import { CbFooterComponent } from './cb-footer/cb-footer.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CbMenuComponent, CbFooterComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'elevate-local-shell';
}
