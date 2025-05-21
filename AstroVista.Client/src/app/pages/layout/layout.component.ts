import { Component } from '@angular/core';
import { NavigationComponent } from '../../components/navigation/navigation.component';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-layout',
  imports: [NavigationComponent, RouterOutlet],
  templateUrl: './layout.component.html',
})
export class LayoutComponent {}
