import type { AppDescription, ButtonForVertical } from './models';

export const LIST_APPLICATIONS: AppDescription[] = [
  { app_description: 'ER-PSP-Screening' },
  { app_description: 'ER-PSP-Prevenzione' },
];

export const BUTTONS_BY_VERTICAL: Record<string, ButtonForVertical> = {
  'ER-PSP-Screening': {
    user_enabled: true,
    buttons: [
      {
        description: ['Screening', 'Gestione Percorsi Screening'],
        button_enabled: false,
        url_login: 'https://www.screening.it/login',
        url_logout: 'http://www.screening.it/logout',
        url_image_svg:
          'https://dev.w3.org/SVG/tools/svgweb/samples/svg-files/android.svg',
      },
    ],
  },
  'ER-PSP-Prevenzione': {
    user_enabled: true,
    buttons: [
      {
        description: ['Prevenzione', 'Gestione percorsi di prevenzione'],
        button_enabled: true,
        url_login: 'https://www.prevenzione.it/login',
        url_logout: 'http://www.prevenzione.it/logout',
        url_image_svg:
          'https://dev.w3.org/SVG/tools/svgweb/samples/svg-files/android.svg',
      },
      {
        description: ['Prevenzione2', 'Gestione percorsi di prevenzione2'],
        button_enabled: true,
        url_login: 'https://www.prevenzione.it/login',
        url_logout: 'http://www.prevenzione.it/logout',
        url_image_svg:
          'https://dev.w3.org/SVG/tools/svgweb/samples/svg-files/android.svg',
      },
      {
        description: ['Prevenzione3', 'Gestione percorsi di prevenzione2'],
        button_enabled: true,
        url_login: 'https://www.prevenzione.it/login',
        url_logout: 'http://www.prevenzione.it/logout',
        url_image_svg:
          'https://dev.w3.org/SVG/tools/svgweb/samples/svg-files/android.svg',
      },
    ],
  },
};
