import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LocationDetailsSectionComponent } from './location-details-section.component';

describe('LocationDetailsSectionComponent', () => {
  let component: LocationDetailsSectionComponent;
  let fixture: ComponentFixture<LocationDetailsSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LocationDetailsSectionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LocationDetailsSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
