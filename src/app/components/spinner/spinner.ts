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
  @Input() styleClass = '';
  @Input() message = 'common.loading';
}
