import { Component } from '@angular/core';
import { MenuComponent } from '../menu/menu.component';
import { NewsComponent } from '../news/news.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [MenuComponent,NewsComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  portalName: string = 'CLUB BAYER';

}
