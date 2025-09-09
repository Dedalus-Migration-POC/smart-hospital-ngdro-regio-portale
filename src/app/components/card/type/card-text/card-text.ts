import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { CardText } from '../../card.models';

@Component({
  selector: 'app-card-text',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './card-text.html',
  styleUrl: './card-text.scss',
})
export class CardTextComponent {
  @Input({ required: true }) card!: CardText;
}
