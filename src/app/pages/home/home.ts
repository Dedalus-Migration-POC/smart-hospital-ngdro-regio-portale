import { Component, OnInit, Signal, computed, inject } from '@angular/core';
import { CardComponent } from '../../components/card/card';
import { TranslateModule } from '@ngx-translate/core';
import {
  CardContainer,
  CardImage,
  CardText,
} from '../../components/card/card.models';
import { ContentStore } from '../../services/content.store';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [TranslateModule, CardComponent],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class HomeComponent implements OnInit {
  contentStore = inject(ContentStore);
  authService = inject(AuthService);

  cardHowItWorksContainer: CardContainer = {
    title: 'home.how-it-works.title',
    description: 'home.how-it-works.subtitle',
    styleClassContainer: 'container-how-it-works',
    styleClassDescription: 'mb-4',
    ariaLabelList: 'home.how-it-works.description',
  };

  cardHowItWorks = computed<CardText[]>(() => {
    return (this.contentStore.howItWorks() ?? []).map((item) => ({
      id: item.id,
      title: item.title,
      description: item.description,
      styleClassCard: 'card-how-it-works',
      styleClassTitle: 'card-how-it-works-title',
      styleClassDescription: 'card-how-it-works-description',
      showArrow: true,
      type: 'text',
    }));
  });

  cardRegionalServicesContainer: CardContainer = {
    title: 'home.regional-services.title',
    description: 'home.regional-services.subtitle',
    styleClassContainer: 'container-regional-service',
    ariaLabelList: 'home.regional-service.description',
  };

  cardRegionalServices = computed<CardImage[]>(() => {
    return (this.contentStore.regionalServices() ?? []).map((item) => ({
      id: item.id,
      title: item.title,
      description: item.description,
      href: item.href,
      styleClassCard: 'card-regional-service',
      styleClassTitle: 'card-regional-service-title',
      styleClassDescription: 'text-regional-service-description',
      pathImage: 'assets/images/regional-services/' + item.id + '.svg',
      imagePos: 'right',
      type: 'image',
    }));
  });

  ngOnInit(): void {
    if (!this.contentStore.loaded()) {
      this.contentStore.loadAll();
    }
  }

  login(event: MouseEvent) {
    event.preventDefault();
    const url = this.authService.login();

    window.location.href = url;
  }
}
