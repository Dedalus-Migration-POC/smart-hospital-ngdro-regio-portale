import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardLink } from './card-link';

describe('CardLink', () => {
  let component: CardLink;
  let fixture: ComponentFixture<CardLink>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardLink]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CardLink);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
