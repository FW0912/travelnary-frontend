import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LocationDetailsPopupComponent } from './location-details-popup.component';

describe('LocationDetailsPopupComponent', () => {
  let component: LocationDetailsPopupComponent;
  let fixture: ComponentFixture<LocationDetailsPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LocationDetailsPopupComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LocationDetailsPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
