import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import {StarFieldComponent} from '../../components/star-field/star-field.component';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-landing',
  standalone: true,
  templateUrl: './landing.component.html',
  imports: [RouterLink, StarFieldComponent, TranslateModule],
  styleUrls: ['./landing.component.scss']
})
export class LandingComponent {


  constructor() { }
}
