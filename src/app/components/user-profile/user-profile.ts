import { Component, inject, OnInit } from '@angular/core';
import { AuthService, JwtClaims } from '../../services/auth.service';
import { format } from 'date-fns';
import { it } from 'date-fns/locale';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [TranslateModule],
  templateUrl: './user-profile.html',
  styleUrls: ['./user-profile.scss'],
})
export class UserProfileComponent implements OnInit {
  private authService = inject(AuthService);

  user = {
    name: '',
    lastLogin: '',
  };

  ngOnInit(): void {
    const claims = this.authService.getClaims();

    this.user = {
      name: claims?.given_name ?? claims?.family_name ?? 'Utente',
      lastLogin: this.formatLastLogin(claims?.iat),
    };
  }

  private formatLastLogin(iat?: number): string {
    if (!iat) return '';

    const date = new Date(iat * 1000); // converto da secondi (JWT) a millisecondi (JS Date).

    return format(date, 'dd/MM/yyyy HH:mm', { locale: it });
  }

  logout() {
    this.authService.logout();
  }
}
