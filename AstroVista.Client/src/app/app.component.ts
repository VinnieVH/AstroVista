import { Component } from '@angular/core';
import {RouterOutlet, RouterState, RouterStateSnapshot, TitleStrategy} from '@angular/router';

import { NavigationComponent } from './components/navigation/navigation.component';
import {TranslateModule, TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, TranslateModule],
  templateUrl: './app.component.html'
})
export class AppComponent {
  constructor(private translate: TranslateService) {
    this.translate.addLangs(['en', 'nl']);
    this.translate.setDefaultLang('en');
    this.translate.use(this.translate.getBrowserLang() || "en");
  }
}
