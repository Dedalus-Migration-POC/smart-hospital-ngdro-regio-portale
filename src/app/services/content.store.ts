import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { forkJoin, firstValueFrom } from 'rxjs';

// Contenuto caricato dai file .json (homepage) => assets/content/*.json

export interface ContentItem {
  id: string;
  title: string;
  description: string;
  href?: string;
}

export type HowItWorksStep = ContentItem;
export type RegionalService = ContentItem;

// Gestione del contenuto delle card caricate da json con i signal, uno store
@Injectable({ providedIn: 'root' })
export class ContentStore {
  private http = inject(HttpClient);

  private _howItWorks = signal<HowItWorksStep[] | null>(null);
  private _regional = signal<RegionalService[] | null>(null);
  private _loaded = signal(false);
  private _error = signal<string | null>(null);

  howItWorks = computed(() => this._howItWorks() ?? []);
  regionalServices = computed(() => this._regional() ?? []);
  loaded = computed(() => this._loaded());
  error = computed(() => this._error());

  async loadAll(): Promise<void> {
    try {
      const res = await firstValueFrom(
        forkJoin({
          how: this.http.get<HowItWorksStep[]>(
            '/assets/content/how-it-works.json',
          ),
          reg: this.http.get<RegionalService[]>(
            '/assets/content/regional-services.json',
          ),
        }),
      );
      this._howItWorks.set(res.how);
      this._regional.set(res.reg);
      this._loaded.set(true);
    } catch {
      this._error.set('Impossibile caricare i contenuti statici.');
      this._loaded.set(true);
    }
  }

  clear() {
    this._howItWorks.set(null);
    this._regional.set(null);
    this._loaded.set(false);
    this._error.set(null);
  }
}
