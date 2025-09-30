import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanGalleryComponent } from './plan-gallery.component';

describe('PlanGalleryComponent', () => {
  let component: PlanGalleryComponent;
  let fixture: ComponentFixture<PlanGalleryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlanGalleryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlanGalleryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
