import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NewsComponent } from './news/news.component';
import { MenuComponent } from './menu/menu.component';
import { HeaderComponent } from './header/header.component'
import { ClubbayerfooterComponent } from './clubbayerfooter/clubbayerfooter.component'
// import { ClubbayerheaderComponent } from './clubbayerheader/clubbayerheader.component'

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NewsComponent, MenuComponent, HeaderComponent, ClubbayerfooterComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'clubbayer-poc-angular-app';
}
