// features/dashboard/service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {
  Observable,
  Subject,
  from,
  map,
  mergeMap,
  of,
  scan,
  shareReplay,
  startWith,
  switchMap,
  catchError,
  delay,
} from 'rxjs';
import { environment } from '../../../environments/environment.development';

import { AppDescription, ButtonForVertical } from './models';
import { Card, CardAction } from '../../components/card/card.models';
import { BUTTONS_BY_VERTICAL, LIST_APPLICATIONS } from './mock';

// POST => /get-buttons-for-vertical
export interface LoadState {
  total: number; // numero totale di POST attese
  completed: number; // POST concluse (OK o errore)
  loading: boolean; // completed < total
}

export interface DashboardStream {
  cards: Card[];
  load: LoadState;
  listError: boolean; // true se fallisce /list-applications
  postFailed: boolean; // true se almeno una POST fallisce
  failedCount: number; // numero di POST fallite
}

@Injectable()
export class DashboardService {
  private readonly IS_DEV = false;

  private readonly maxConcurrency = Math.max(
    1,
    environment.dashboard?.postsConcurrency ?? 6,
  );

  private readonly refresh$ = new Subject<void>();

  /** Stream viewModel */
  readonly stream$: Observable<DashboardStream> = this.refresh$.pipe(
    startWith(void 0), // prima esecuzione subito
    switchMap(() => this.buildStream()),
    shareReplay({ bufferSize: 1, refCount: true }),
  );

  constructor(private http: HttpClient) {}

  /** Ricarica tutto (/list-applications + /get-buttons-for-vertical) */
  reload(): void {
    this.refresh$.next();
  }

  private getListApplications(): Observable<AppDescription[]> {
    if (this.IS_DEV) {
      return of(LIST_APPLICATIONS).pipe(delay(2000));
    }

    return this.http.get<AppDescription[]>('/list-applications');
  }

  private getButtonsForVertical(
    app_description: string,
  ): Observable<ButtonForVertical> {
    if (this.IS_DEV) {
      const payload = BUTTONS_BY_VERTICAL[app_description] ?? {
        user_enabled: false,
        buttons: [],
      };
      // delay random per simulare concorrenza
      // const extra = 300 + Math.floor(Math.random() * 600);
      return of(payload).pipe(delay(5000));
    }

    return this.http.post<ButtonForVertical>('/get-buttons-for-vertical', {
      app_description,
    });
  }

  private buildStream(): Observable<DashboardStream> {
    return this.getListApplications().pipe(
      switchMap((apps) => {
        const list = (apps ?? [])
          .map((a) => ({
            app_description: `${a?.app_description ?? ''}`.trim(),
          }))
          .filter((a) => !!a.app_description);

        const total = list.length;
        if (!total) {
          return of<DashboardStream>({
            cards: [],
            load: { total: 0, completed: 0, loading: false },
            listError: false,
            postFailed: false,
            failedCount: 0,
          });
        }

        const postConcurrency = Math.min(this.maxConcurrency, total);

        // Ogni POST => { cards, done, failed }
        // (mantiene l'ordine ricevuto dal BE)
        const updates$ = from(list.map((a, i) => ({ a, i }))).pipe(
          mergeMap(
            ({ a, i }) =>
              this.getButtonsForVertical(a.app_description).pipe(
                map((res) => {
                  if (!res?.user_enabled) {
                    return {
                      i,
                      cards: [] as CardAction[],
                      done: true,
                      failed: false,
                    };
                  }
                  const buttons = res.buttons ?? [];
                  const cards: CardAction[] = buttons.map((btn, j) => ({
                    id: `app-${i}-btn-${j}`,
                    type: 'action',
                    title: (btn.description?.[0] ?? '').trim(),
                    description: (btn.description?.[1] ?? '').trim(),
                    styleClassCard: 'card-regional-service p-0',
                    styleClassTitle: 'card-regional-service-available-title',
                    styleClassDescription: 'text-regional-service-description',
                    button_enable: !!btn.button_enabled,
                    url_login: btn.url_login,
                    url_logout: btn.url_logout,
                    url_image_svg: btn.url_image_svg,
                  }));
                  return { i, cards, done: true, failed: false };
                }),
                // errore: conta come done + failed
                catchError(() =>
                  of({
                    i,
                    cards: [] as CardAction[],
                    done: true,
                    failed: true,
                  }),
                ),
              ),
            postConcurrency,
          ),

          // accumula card, progress, errori
          // (mantiene sempre l'ordine ricevuto dal BE)
          scan(
            (acc, upd) => {
              acc.slots[upd.i] = upd.cards; // posiziona il risultato nella sua posizione originale
              acc.completed += upd.done ? 1 : 0;
              acc.failedCount += upd.failed ? 1 : 0;
              return acc;
            },
            {
              slots: Array.from({ length: total }, () => [] as CardAction[]),
              completed: 0,
              failedCount: 0,
            } as {
              slots: CardAction[][];
              completed: number;
              failedCount: number;
            },
          ),

          // mappa alla viewModel => ciò che serve nel template (card, loading, errori)
          map(({ slots, completed, failedCount }) => ({
            cards: slots.flat() as Card[],
            load: { total, completed, loading: completed < total } as LoadState,
            listError: false,
            postFailed: failedCount > 0,
            failedCount,
          })),

          // stato iniziale: total, loading=true
          startWith({
            cards: [] as Card[],
            load: { total, completed: 0, loading: true } as LoadState,
            listError: false,
            postFailed: false,
            failedCount: 0,
          }),
        );

        return updates$;
      }),

      // se fallisce la GET iniziale => listError=true
      catchError(() =>
        of<DashboardStream>({
          cards: [],
          load: { total: 0, completed: 0, loading: false },
          listError: true,
          postFailed: false,
          failedCount: 0,
        }),
      ),
    );
  }
}
