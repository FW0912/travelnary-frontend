import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditLocationPopupComponent } from './edit-location-popup.component';

describe('EditLocationPopupComponent', () => {
  let component: EditLocationPopupComponent;
  let fixture: ComponentFixture<EditLocationPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditLocationPopupComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditLocationPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
