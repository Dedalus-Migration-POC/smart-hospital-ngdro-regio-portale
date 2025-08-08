import { ActionReducerMap } from '@ngrx/store';
import * as fromHomeState from '../pages/home/state/reducer';
import * as fromDashboardState from '../pages/dashboard/state/reducer';

export interface SmartHospitalState {
  [fromHomeState.featureKey]: fromHomeState.State;
  [fromDashboardState.featureKey]: fromDashboardState.State;
}

export const reducers: ActionReducerMap<SmartHospitalState> = {
  [fromHomeState.featureKey]: fromHomeState.reducer,
  [fromDashboardState.featureKey]: fromDashboardState.reducer,
};
