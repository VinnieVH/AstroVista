import {Component, Input} from '@angular/core';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-primary-button',
  imports: [
    RouterLink
  ],
  templateUrl: './primary-button.component.html',
})
export class PrimaryButtonComponent {

  @Input() text: string = '';
}
