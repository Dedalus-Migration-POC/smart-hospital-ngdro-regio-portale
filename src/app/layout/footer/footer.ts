import { Component, input, Signal } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { MenuLink } from '../../models/menu.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [TranslateModule, CommonModule],
  templateUrl: './footer.html',
  styleUrl: './footer.scss',
})
export class FooterComponent {
  social = input<Signal<MenuLink[]>>();
  smallPrint: Array<MenuLink> = [
    {
      labelI18n: 'footer.small-print.privacy',
      link: '',
      isExternal: true,
    },
    {
      labelI18n: 'footer.small-print.disclosure',
      link: '',
      isExternal: true,
    },
    {
      labelI18n: 'footer.small-print.site-map',
      link: '',
      isExternal: true,
    },
  ];

  get socialLinks(): MenuLink[] {
    return this.social()?.() ?? [];
  }
}
