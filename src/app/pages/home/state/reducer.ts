import { createReducer, on } from '@ngrx/store';
import {
  fetchLoginServices,
  fetchLoginServicesSuccess,
  fetchLoginServicesFailure,
  fetchRegionalServices,
  fetchRegionalServicesSuccess,
  fetchRegionalServicesFailure,
} from './actions';
import { LoginService, RegionalService } from './models';

export const featureKey = 'home';

export interface State {
  loginService: Array<LoginService>;
  loginServiceLoading: boolean;
  loginServiceError: boolean;
  regionalService: Array<RegionalService>;
  regionalServiceLoading: boolean;
  regionalServiceError: boolean;
}

export const initialState: State = {
  loginService: [],
  loginServiceLoading: false,
  loginServiceError: false,
  regionalService: [],
  regionalServiceLoading: false,
  regionalServiceError: false,
};

export const reducer = createReducer(
  initialState,
  on(fetchLoginServices, (state) => ({
    ...state,
    loginServiceLoading: true,
    loginServiceError: false,
  })),
  on(fetchLoginServicesSuccess, (state, { services }) => ({
    ...state,
    loginService: services,
    loginServiceLoading: false,
  })),
  on(fetchLoginServicesFailure, (state) => ({
    ...state,
    loginServiceLoading: false,
    loginServiceError: true,
  })),

  on(fetchRegionalServices, (state) => ({
    ...state,
    regionalServiceLoading: true,
    regionalServiceError: false,
  })),
  on(fetchRegionalServicesSuccess, (state, { services }) => ({
    ...state,
    regionalService: services,
    regionalServiceLoading: false,
  })),
  on(fetchRegionalServicesFailure, (state) => ({
    ...state,
    regionalServiceLoading: false,
    regionalServiceError: true,
  })),
);
