import { CardAction } from '../../components/card/card.models';

export interface AppDescription {
  app_description: string;
}

export interface ButtonForVertical {
  user_enabled: boolean;
  buttons: Array<ButtonContent>;
}

export interface ButtonContent {
  description: string[]; // primo valore titolo, secondo sottotitolo (se presente)
  button_enabled: boolean;
  url_login: string;
  url_logout: string;
  url_image_svg: string;
}

// struttura creata da me per la gestione delle card nella dashboard
export interface BlockButtonVertical {
  app: AppDescription;
  data?: ButtonForVertical;
}

// Gestiscono lo stato "transitorio" delle card

// Gestione dello stream
export type CardVm = {
  key: string;
  data?: CardAction; // quando presente, la card è pronta
};

// Serve per il template
export type UiItem =
  | { kind: 'skeleton'; key: string }
  | { kind: 'card'; key: string; card: CardAction };
