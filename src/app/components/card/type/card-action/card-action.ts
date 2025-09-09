import { Component, inject, Input } from '@angular/core';
import { CardAction } from '../../card.models';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../../services/auth.service';

@Component({
  standalone: true,
  selector: 'app-card-action',
  templateUrl: './card-action.html',
  styleUrl: './card-action.scss',
  imports: [CommonModule],
})
export class CardActionComponent {
  @Input({ required: true }) card!: CardAction;

  private authService = inject(AuthService);

  async onCardClick(ev: MouseEvent, cardId: string, urlLogin: string) {
    ev.preventDefault();

    const token = await this.authService.getValidAccessToken(60);
    if (!token) return;

    const urlWithToken = this.appendQuery(urlLogin, 'token', token);
    window.open(urlWithToken, `card-${cardId}`, 'noopener,noreferrer');
  }

  private appendQuery(rawUrl: string, key: string, value: string): string {
    const url = new URL(rawUrl, window.location.origin);
    url.searchParams.set(key, value);
    return url.toString();
  }
}
