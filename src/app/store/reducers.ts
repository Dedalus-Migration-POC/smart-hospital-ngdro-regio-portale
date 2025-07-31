import { ActionReducerMap } from '@ngrx/store';
import * as fromHomeState from '../pages/home/state/reducer';

export interface SmartHospitalState {
  [fromHomeState.featureKey]: fromHomeState.State;
}

export const reducers: ActionReducerMap<SmartHospitalState> = {
  [fromHomeState.featureKey]: fromHomeState.reducer,
};
