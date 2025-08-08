import { Component, OnInit, Signal, computed } from '@angular/core';
import { CardComponent } from '../../components/card/card';
import { TranslateModule } from '@ngx-translate/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Store } from '@ngrx/store';
import { fetchLoginServices, fetchRegionalServices } from './state/actions';
import { selectLoginService, selectRegionalService } from './state/selectors';
import { SmartHospitalState } from '../../store/reducers';
import { CommonModule } from '@angular/common';
import { ErrorMessageComponent } from '../../components/error-message/error-message';
import { SpinnerComponent } from '../../components/spinner/spinner';
import {
  CardContainer,
  CardImage,
  CardLink,
} from '../../components/card/models';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../store/auth.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    ErrorMessageComponent,
    SpinnerComponent,
    CardComponent,
  ],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class HomeComponent implements OnInit {
  loginService: Signal<{ data: any[]; loading: boolean; error: boolean }>;
  regionalService: Signal<{ data: any[]; loading: boolean; error: boolean }>;

  cardLinksLoginServices = computed<CardLink[]>(() => {
    return this.loginService().data.map((item) => ({
      title: item.title,
      description: item.description,
      href: item.href,
      styleClassCard: 'card-login-service',
      styleClassTitle: 'card-login-service-title',
      styleClassDescription: 'card-login-service-description',
      showArrow: true,
      type: 'link',
    }));
  });

  cardImageRegionalServices = computed<CardImage[]>(() => {
    return this.regionalService().data.map((item) => ({
      title: item.title,
      description: item.description,
      href: item.href,
      styleClassCard: 'card-regional-service',
      styleClassTitle: 'card-regional-service-title',
      image: 'assets/images/regional-services/' + item.id + '.svg',
      imagePos: 'right',
      type: 'image',
    }));
  });

  cardLinkLoginServicesContainer: CardContainer = {
    title: 'home.login-service.title',
    description: 'home.login-service.subtitle',
    styleClassContainer: 'container-login-service',
    styleClassDescription: 'mb-4',
    ariaLabelList: 'home.login-service.service',
  };

  cardImageRegionalServicesContainer: CardContainer = {
    title: 'home.regional-services.title',
    description: 'home.regional-services.subtitle',
    styleClassContainer: 'container-regional-service container',
    ariaLabelList: 'home.regional-service.service',
  };

  constructor(
    private store: Store<SmartHospitalState>,
    private route: ActivatedRoute,
    private authService: AuthService,
  ) {
    this.loginService = toSignal(this.store.select(selectLoginService), {
      initialValue: { data: [], loading: true, error: false },
    });

    this.regionalService = toSignal(this.store.select(selectRegionalService), {
      initialValue: { data: [], loading: true, error: false },
    });
  }

  ngOnInit(): void {
    this.store.dispatch(fetchLoginServices());
    this.store.dispatch(fetchRegionalServices());

    // this.route.queryParamMap.subscribe((params) => {
    //   const encryptedCode = params.get('code');
    //   const passphrase = '66e8de09-aaba-4e78-a8de-09aaba5e78a2';

    //   if (encryptedCode && passphrase) {
    //     console.log(this.authService.decryptCode(encryptedCode, passphrase));
    //   } else {
    //     console.error('ERRORE DECODIFICA');
    //   }
    // });
  }

  onRetryLogin(): void {
    this.store.dispatch(fetchLoginServices());
  }

  onRetryRegional(): void {
    this.store.dispatch(fetchRegionalServices());
  }
}
