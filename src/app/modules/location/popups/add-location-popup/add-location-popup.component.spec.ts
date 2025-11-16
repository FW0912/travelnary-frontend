import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddLocationPopupComponent } from './add-location-popup.component';

describe('AddLocationPopupComponent', () => {
  let component: AddLocationPopupComponent;
  let fixture: ComponentFixture<AddLocationPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddLocationPopupComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddLocationPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
