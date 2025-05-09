import { Component } from '@angular/core';
import {NavigationComponent} from "../../components/navigation/navigation.component";
import {RouterOutlet} from "@angular/router";

@Component({
  selector: 'app-layout',
  imports: [
      NavigationComponent,
      RouterOutlet
  ],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss'
})
export class LayoutComponent {

}
