import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromHomeState from './reducer';

export const selectHomeState = createFeatureSelector<fromHomeState.State>(
  fromHomeState.featureKey,
);

//-----------------loginService

export const selectLoginServiceData = createSelector(
  selectHomeState,
  (state) => state.loginService,
);
export const selectLoginServiceLoading = createSelector(
  selectHomeState,
  (state) => state.loginServiceLoading,
);
export const selectLoginServiceError = createSelector(
  selectHomeState,
  (state) => state.loginServiceError,
);
export const selectLoginService = createSelector(
  selectLoginServiceData,
  selectLoginServiceLoading,
  selectLoginServiceError,
  (data, loading, error) => ({ data, loading, error }),
);

//-----------------regionalService
export const selectRegionalServiceData = createSelector(
  selectHomeState,
  (state) => state.regionalService,
);
export const selectRegionalServiceLoading = createSelector(
  selectHomeState,
  (state) => state.regionalServiceLoading,
);
export const selectRegionalServiceError = createSelector(
  selectHomeState,
  (state) => state.regionalServiceError,
);
export const selectRegionalService = createSelector(
  selectRegionalServiceData,
  selectRegionalServiceLoading,
  selectRegionalServiceError,
  (data, loading, error) => ({ data, loading, error }),
);
