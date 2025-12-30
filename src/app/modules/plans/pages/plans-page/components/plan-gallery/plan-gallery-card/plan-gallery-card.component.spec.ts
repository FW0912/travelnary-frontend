import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanGalleryCardComponent } from './plan-gallery-card.component';

describe('PlanGalleryCardComponent', () => {
  let component: PlanGalleryCardComponent;
  let fixture: ComponentFixture<PlanGalleryCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlanGalleryCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlanGalleryCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
