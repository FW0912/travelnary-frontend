import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LocationMapPopupComponent } from './location-map-popup.component';

describe('LocationMapPopupComponent', () => {
  let component: LocationMapPopupComponent;
  let fixture: ComponentFixture<LocationMapPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LocationMapPopupComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LocationMapPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
