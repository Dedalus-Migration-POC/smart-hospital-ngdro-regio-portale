import { createAction, props } from '@ngrx/store';
import { LoginService, RegionalService } from './models';

export const fetchLoginServices = createAction('[Home] Fetch Login Services');
export const fetchLoginServicesSuccess = createAction(
  '[Home] Fetch Login Services Success',
  props<{ services: LoginService[] }>(),
);
export const fetchLoginServicesFailure = createAction(
  '[Home] Fetch Login Services Failure',
  props<{ error: any }>(),
);

export const fetchRegionalServices = createAction(
  '[Home] Fetch Regional Services',
);
export const fetchRegionalServicesSuccess = createAction(
  '[Home] Fetch Regional Services Success',
  props<{ services: RegionalService[] }>(),
);
export const fetchRegionalServicesFailure = createAction(
  '[Home] Fetch Regional Services Failure',
  props<{ error: any }>(),
);
