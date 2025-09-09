import { Component, inject, input, Signal } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { MenuLink } from '../menu.model';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, TranslateModule, RouterModule],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class HeaderComponent {
  private authService = inject(AuthService);
  public router = inject(Router);

  isAuthenticated = this.authService.isAuthenticated;

  social = input<Signal<MenuLink[]>>();

  menu: Array<MenuLink> = [
    // {
    //   labelI18n: 'header.menu.home',
    //   link: '/home',
    // },
    {
      labelI18n: 'header.menu.faq',
      link: '/faq',
    },
    {
      labelI18n: 'header.menu.support',
      link: '/support',
    },
  ];

  get socialLinks(): MenuLink[] {
    return this.social()?.() ?? [];
  }

  get authenticated(): boolean {
    return this.isAuthenticated();
  }

  login(event: MouseEvent) {
    event.preventDefault();
    const url = this.authService.login();

    window.location.href = url;
  }

  logout() {
    this.authService.logout();
  }
}
