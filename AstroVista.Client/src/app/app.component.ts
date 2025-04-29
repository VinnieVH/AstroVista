import { Component } from '@angular/core';
import {RouterOutlet, RouterState, RouterStateSnapshot, TitleStrategy} from '@angular/router';

import { NavigationComponent } from './components/navigation/navigation.component';
import {TranslateModule, TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavigationComponent, TranslateModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  constructor(private translate: TranslateService) {
    this.translate.addLangs(['de', 'en', 'nl']);
    this.translate.setDefaultLang('en');
    this.translate.use(this.translate.getBrowserLang() || "en");
  }
}
