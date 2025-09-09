import { Injectable, signal } from '@angular/core';

// Serve per far partire uno spinner global mentre la guard è in
// elaborazione
@Injectable({ providedIn: 'root' })
export class LoadingService {
  private _active = signal(false);

  // leggibile nei template: loading.active()
  readonly active = this._active;

  show() {
    this._active.set(true);
  }
  hide() {
    this._active.set(false);
  }
}
