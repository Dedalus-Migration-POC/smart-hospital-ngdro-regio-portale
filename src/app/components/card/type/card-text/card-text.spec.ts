import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Cardtext } from './card-text';

describe('Cardtext', () => {
  let component: Cardtext;
  let fixture: ComponentFixture<Cardtext>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Cardtext],
    }).compileComponents();

    fixture = TestBed.createComponent(Cardtext);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
