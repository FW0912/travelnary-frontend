import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SharePlanPopupComponent } from './share-plan-popup.component';

describe('SharePlanPopupComponent', () => {
  let component: SharePlanPopupComponent;
  let fixture: ComponentFixture<SharePlanPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SharePlanPopupComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SharePlanPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
