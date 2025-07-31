import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { CardImage } from '../../models';

@Component({
  selector: 'app-card-image',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './card-image.html',
  styleUrl: './card-image.scss',
})
export class CardImageComponent {
  @Input({ required: true }) card!: CardImage;
}
