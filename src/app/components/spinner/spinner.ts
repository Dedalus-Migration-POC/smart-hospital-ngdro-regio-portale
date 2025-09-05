import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-spinner',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './spinner.html',
  styleUrl: './spinner.scss',
})
export class SpinnerComponent {
  @Input() styleClassContainer = '';
  @Input() styleClassSpinner = '';
  @Input() message = 'common.loading'; // non visibile di default, serve per l'accessibilità, se showLabel => true allora si visualizza
  @Input() showLabel = false; // se visualizzare o meno la label insieme allo spinner
}
