export interface MenuLink {
  labelI18n: string;
  link: string;
  isExternal?: boolean;
  image?: string;
  showTo?: 'Header' | 'Footer';
  styleClass?: string;
}
