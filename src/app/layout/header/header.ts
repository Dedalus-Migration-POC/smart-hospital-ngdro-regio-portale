import { Component, input, Signal } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { MenuLink } from '../../models/menu.model';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, TranslateModule, RouterModule],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class HeaderComponent {
  social = input<Signal<MenuLink[]>>();

  menu: Array<MenuLink> = [
    {
      labelI18n: 'header.menu.home',
      link: '/home',
    },
    {
      labelI18n: 'header.menu.faq',
      link: '/faq',
    },
    {
      labelI18n: 'header.menu.support',
      link: '/support',
    },
  ];

  constructor(public router: Router) {}

  get socialLinks(): MenuLink[] {
    return this.social()?.() ?? [];
  }
}
