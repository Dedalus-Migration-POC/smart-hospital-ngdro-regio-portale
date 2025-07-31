import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { CardLink } from '../../models';

@Component({
  selector: 'app-card-link',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './card-link.html',
  styleUrl: './card-link.scss',
})
export class CardLinkComponent {
  @Input({ required: true }) card!: CardLink;
}
