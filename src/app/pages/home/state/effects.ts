import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { HomeService } from './service';

import {
  fetchLoginServices,
  fetchLoginServicesSuccess,
  fetchLoginServicesFailure,
  fetchRegionalServices,
  fetchRegionalServicesFailure,
  fetchRegionalServicesSuccess,
} from './actions';

import { of } from 'rxjs';
import { map, catchError, concatMap } from 'rxjs/operators';
import { LoginService, RegionalService } from './models';

@Injectable()
export class HomeEffects {
  private actions$ = inject(Actions);
  private homeService = inject(HomeService);

  loadLoginServices$ = createEffect(() =>
    this.actions$.pipe(
      ofType(fetchLoginServices),
      concatMap(() =>
        this.homeService.fetchLoginServices().pipe(
          map((services: LoginService[]) =>
            fetchLoginServicesSuccess({ services }),
          ),
          catchError((error) => of(fetchLoginServicesFailure({ error }))),
        ),
      ),
    ),
  );

  loadRegionalServices$ = createEffect(() =>
    this.actions$.pipe(
      ofType(fetchRegionalServices),
      concatMap(() =>
        this.homeService.fetchRegionalServices().pipe(
          map((services: RegionalService[]) =>
            fetchRegionalServicesSuccess({ services }),
          ),
          catchError((error) => of(fetchRegionalServicesFailure({ error }))),
        ),
      ),
    ),
  );
}
