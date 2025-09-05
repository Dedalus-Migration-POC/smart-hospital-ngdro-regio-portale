import { Component, computed, signal, Signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './layout/header/header';
import { FooterComponent } from './layout/footer/footer';
import { MenuLink } from './layout/menu.model';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, FooterComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected readonly title = signal('regio-portale');

  social: Signal<MenuLink[]> = signal([
    {
      labelI18n: 'common.social.facebook',
      link: 'https://facebook.com',
      image: 'assets/images/social/facebook.svg',
    },
    {
      labelI18n: 'common.social.instagram',
      link: 'https://instagram.com',
      image: 'assets/images/social/instagram.svg',
    },
    {
      labelI18n: 'common.social.twitter',
      link: 'https://twitter.com',
      image: 'assets/images/social/twitter.svg',
    },
    {
      labelI18n: 'common.social.youtube',
      link: 'https://youtube.com',
      image: 'assets/images/social/youtube.svg',
    },
  ]);

  headerSocial = computed(() =>
    this.social().filter(
      (link) => link.showTo === 'Header' || link.showTo === undefined,
    ),
  );

  footerSocial = computed(() =>
    this.social().filter(
      (link) => link.showTo === 'Footer' || link.showTo === undefined,
    ),
  );
}
