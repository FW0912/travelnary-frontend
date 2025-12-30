import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LocationDetailsCardComponent } from './location-details-card.component';

describe('LocationDetailsCardComponent', () => {
  let component: LocationDetailsCardComponent;
  let fixture: ComponentFixture<LocationDetailsCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LocationDetailsCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LocationDetailsCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
