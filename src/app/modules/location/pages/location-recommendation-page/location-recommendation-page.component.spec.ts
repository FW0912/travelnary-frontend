import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LocationRecommendationPageComponent } from './location-recommendation-page.component';

describe('LocationRecommendationPageComponent', () => {
  let component: LocationRecommendationPageComponent;
  let fixture: ComponentFixture<LocationRecommendationPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LocationRecommendationPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LocationRecommendationPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
