import { Component, inject, computed } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import {
  map,
  distinctUntilChanged,
  switchMap,
  startWith,
  timer,
  of,
} from 'rxjs';

import { DashboardService } from './service';
import { Card, CardContainer } from '../../components/card/card.models';
import { CardComponent } from '../../components/card/card';
import { UserProfileComponent } from '../../components/user-profile/user-profile';
import { SpinnerComponent } from '../../components/spinner/spinner';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    CardComponent,
    UserProfileComponent,
    SpinnerComponent,
  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
  providers: [DashboardService],
})
export class DashboardComponent {
  private dashboardService = inject(DashboardService);

  // viewModel dallo stream
  viewModel = toSignal(this.dashboardService.stream$, {
    initialValue: {
      cards: [] as Card[],
      load: { total: 0, completed: 0, loading: true },
      listError: false,
      postFailed: false,
      failedCount: 0,
    },
  });

  cards = computed(() => this.viewModel().cards);
  load = computed(() => this.viewModel().load);

  /** Spinner iniziale finché non arriva la prima emissione (/list-applications) */
  bootLoading = toSignal(
    this.dashboardService.stream$.pipe(
      map(() => false),
      startWith(true),
      distinctUntilChanged(),
    ),
    { initialValue: true },
  );

  /** Caricamento interno a <app-card>: resta attivo finché completed < total */
  showLoadingChip = toSignal(
    this.dashboardService.stream$.pipe(
      map((s) => s.load.loading),
      distinctUntilChanged(),
      switchMap((loading) =>
        loading ? of(true) : timer(250).pipe(map(() => false)),
      ),
      startWith(false), // durante il boot non mostrarlo
    ),
    { initialValue: false },
  );

  /** Stato empty quando non carica più e non ci sono card */
  showEmpty = computed(() => !this.load().loading && this.cards().length === 0);

  cardActionContainer: CardContainer = {
    title: 'dashboard.regional-services-available.title',
    styleClassContainer:
      'container-regional-service container-regional-service-available pe-0',
    ariaLabelList: 'dashboard.regional-services-available.title',
  };

  /** Quando la /list-applications va in errore */
  reload() {
    this.dashboardService.reload();
  }
}
