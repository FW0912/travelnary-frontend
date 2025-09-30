import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewerPlanPageComponent } from './viewer-plan-page.component';

describe('ViewerPlanPageComponent', () => {
  let component: ViewerPlanPageComponent;
  let fixture: ComponentFixture<ViewerPlanPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewerPlanPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewerPlanPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
