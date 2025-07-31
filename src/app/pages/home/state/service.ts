import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LOGIN_SERVICES, REGIONAL_SERVICES } from './mock';
import { Observable, of } from 'rxjs';
import { LoginService, RegionalService } from './models';

@Injectable({
  providedIn: 'root',
})
export class HomeService {
  constructor(private http: HttpClient) {}
  private readonly IS_DEV = true;

  fetchLoginServices(): Observable<Array<LoginService>> {
    if (this.IS_DEV) {
      return of(LOGIN_SERVICES);
    }
    return this.http.get<Array<LoginService>>(``);
  }

  fetchRegionalServices(): Observable<Array<RegionalService>> {
    if (this.IS_DEV) {
      return of(REGIONAL_SERVICES);
    }
    return this.http.get<Array<RegionalService>>(``);
  }
}
