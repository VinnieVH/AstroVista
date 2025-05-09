import { Component } from '@angular/core';
import {StarFieldComponent} from '../../components/star-field/star-field.component';
import {RouterLink} from '@angular/router';
import {PrimaryButtonComponent} from '../../components/primary-button/primary-button.component';

@Component({
  selector: 'app-not-found',
  imports: [
    StarFieldComponent,
    RouterLink,
    PrimaryButtonComponent
  ],
  templateUrl: './not-found.component.html'
})
export class NotFoundComponent {

}
