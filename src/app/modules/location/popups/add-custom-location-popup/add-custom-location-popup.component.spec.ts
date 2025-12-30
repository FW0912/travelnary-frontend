import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddCustomLocationPopupComponent } from './add-custom-location-popup.component';

describe('AddCustomLocationPopupComponent', () => {
  let component: AddCustomLocationPopupComponent;
  let fixture: ComponentFixture<AddCustomLocationPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddCustomLocationPopupComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddCustomLocationPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
