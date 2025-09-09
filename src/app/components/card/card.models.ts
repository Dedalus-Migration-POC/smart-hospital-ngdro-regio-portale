// Basic type for all cards
export interface BaseCard {
  id: string;
  title: string;
  description?: string;
  styleClassTitle?: string;
  styleClassDescription?: string;
  styleClassCard?: string;
}

// not is a card, but its container
export interface CardContainer {
  title: string;
  description?: string;
  ariaLabelList: string;
  styleClassTitle?: string;
  styleClassDescription?: string;
  styleClassContainer?: string;
}

// ----- Specific card types ------
export type Card = CardText | CardImage | CardAction | CardSkeleton;

export interface CardText extends BaseCard {
  description: string;
  showArrow?: boolean;
  type: 'text';
}

export interface CardImage extends BaseCard {
  pathImage: string; // path
  imagePos: 'right' | 'top';
  imageWith?: string;
  imageHeight?: string;
  href?: string;
  type: 'image';
}

// Dashboard
export interface CardAction extends BaseCard {
  type: 'action';
  button_enable: boolean;
  url_login: string;
  url_logout: string;
  url_image_svg: string;
}

// Card vuota con lo spinner
export interface CardSkeleton extends BaseCard {
  type: 'skeleton';
}
