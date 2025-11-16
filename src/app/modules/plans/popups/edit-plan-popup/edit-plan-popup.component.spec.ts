import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditPlanPopupComponent } from './edit-plan-popup.component';

describe('EditPlanPopupComponent', () => {
  let component: EditPlanPopupComponent;
  let fixture: ComponentFixture<EditPlanPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditPlanPopupComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditPlanPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
