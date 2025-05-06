import { Component, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import {TranslateModule, TranslateService} from '@ngx-translate/core';

interface NavLink {
  path: string;
  label: string;
}

@Component({
  selector: 'app-navigation',
  standalone: true,
  imports: [CommonModule, TranslateModule, RouterLink, RouterLinkActive],
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent implements OnInit {
  navLinks: NavLink[] = [
    { path: '/home', label: 'Home' },
    { path: '/history', label: 'History' },
  ];

  isLoggedIn = false; // This will be connected to auth service later
  isMobileMenuOpen = false;
  isMobileView = false;

  username = 'Astronaut Van Herreweghe'; // Mock username

  constructor(private translateService: TranslateService) {}

  ngOnInit(): void {
    this.checkScreenSize();

    this.translateService.get([
      'NAV.PICTURE_OF_THE_DAY'
    ]).subscribe(
      (res: any) => {
        this.navLinks = [...this.navLinks, { path: '/picture-of-the-day', label: res['NAV.PICTURE_OF_THE_DAY'] }];
      }
    )
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.checkScreenSize();
  }

  checkScreenSize() {
    this.isMobileView = window.innerWidth < 768;
    if (!this.isMobileView) {
      this.isMobileMenuOpen = false;
    }
  }

  toggleMobileMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  login() {
    this.isLoggedIn = true;
  }

  logout() {
    this.isLoggedIn = false;
  }
}
