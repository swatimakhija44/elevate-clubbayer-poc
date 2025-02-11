import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CbMenuComponent } from './cb-menu/cb-menu.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CbMenuComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'elevate-local-shell';
}
