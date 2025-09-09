import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Card, CardContainer, CardText } from './card.models';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { CardTextComponent } from './type/card-text/card-text';
import { CardImageComponent } from './type/card-image/card-image';
import { CardActionComponent } from './type/card-action/card-action';
import { SpinnerComponent } from '../spinner/spinner';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    CardTextComponent,
    CardImageComponent,
    CardActionComponent,
    SpinnerComponent,
  ],
  templateUrl: './card.html',
  styleUrl: './card.scss',
})
export class CardComponent {
  @Input() cardContent: Array<Card> = [];
  @Input() cardContainer?: CardContainer;

  // Spinner con label per indicare il caricamento "interno"
  @Input() loading? = false;
  @Input() loadingLabel? = 'common.loading';

  // Gestione degli errori parziali di alcune card
  // @Input() postFailed? = false;
  // @Input() failedCount? = 0;
  // @Input() total? = 0;

  // @Output() reload = new EventEmitter<void>();
}
