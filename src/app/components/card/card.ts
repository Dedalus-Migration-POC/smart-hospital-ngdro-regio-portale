import { Component, Input } from '@angular/core';
import { CardContainer } from './models';
import { CommonModule } from '@angular/common';
import { CardLinkComponent } from './type/card-link/card-link';
import { TranslateModule } from '@ngx-translate/core';
import { CardImageComponent } from './type/card-image/card-image';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    CardLinkComponent,
    CardImageComponent,
  ],
  templateUrl: './card.html',
  styleUrl: './card.scss',
})
export class CardComponent {
  // TODO: <any> poi devi tipicizzarlo
  @Input() cardContent: Array<any> = [];
  @Input() cardContainer?: CardContainer;
}
