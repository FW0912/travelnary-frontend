import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FilterLocationRecommendationsPopupComponent } from './filter-location-recommendations-popup.component';

describe('FilterLocationRecommendationsPopupComponent', () => {
  let component: FilterLocationRecommendationsPopupComponent;
  let fixture: ComponentFixture<FilterLocationRecommendationsPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FilterLocationRecommendationsPopupComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FilterLocationRecommendationsPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
