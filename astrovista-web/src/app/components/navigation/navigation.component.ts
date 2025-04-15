import { Component, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';

interface NavLink {
  path: string;
  label: string;
  icon?: string;
}

@Component({
  selector: 'app-navigation',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent implements OnInit {
  navLinks: NavLink[] = [
    { path: '/', label: 'Home', icon: 'home' },
    { path: '/history', label: 'History', icon: 'public' },
    { path: '/galaxies', label: 'Galaxies', icon: 'blur_circular' },
    { path: '/picture-of-the-day', label: 'Picture of the day', icon: 'rocket' }
  ];

  isLoggedIn = false; // This will be connected to your auth service later
  isMobileMenuOpen = false;
  isMobileView = false;

  username = 'Astronaut Van Herreweghe'; // Mock username

  constructor() {}

  ngOnInit(): void {
    this.checkScreenSize();
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
