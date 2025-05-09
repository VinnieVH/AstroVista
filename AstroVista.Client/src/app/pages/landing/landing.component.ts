import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import {StarFieldComponent} from '../../components/star-field/star-field.component';
import { TranslateModule } from '@ngx-translate/core';
import {PrimaryButtonComponent} from '../../components/primary-button/primary-button.component';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  imports: [StarFieldComponent, TranslateModule, PrimaryButtonComponent]
})
export class LandingComponent {


  constructor() { }
}
