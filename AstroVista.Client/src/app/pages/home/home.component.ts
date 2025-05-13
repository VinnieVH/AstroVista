import { Component } from '@angular/core';
import {SolarSystemComponent} from '../../components/solar-system/solar-system.component';

@Component({
  selector: 'app-home',
  imports: [
    SolarSystemComponent
  ],
  templateUrl: './home.component.html'
})
export class HomeComponent {

}
