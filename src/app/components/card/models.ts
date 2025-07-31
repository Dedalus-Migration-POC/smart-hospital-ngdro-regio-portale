export interface CardContainer {
  title: string;
  description: string;
  ariaLabelList: string;
  styleClassTitle?: string;
  styleClassDescription?: string;
  styleClassContainer?: string;
}

export interface CardLink {
  title: string;
  description: string;
  styleClassTitle?: string;
  styleClassDescription?: string;
  styleClassCard?: string;
  href: string;
  showArrow?: boolean; // whether to show an arrow to the right
  type: 'link';
}

export interface CardImage {
  title: string;
  description: string;
  styleClassTitle?: string;
  styleClassDescription?: string;
  styleClassCard?: string;
  image: string; // path
  imagePos: 'right' | 'top';
  href: string;
  type: 'image';
}
