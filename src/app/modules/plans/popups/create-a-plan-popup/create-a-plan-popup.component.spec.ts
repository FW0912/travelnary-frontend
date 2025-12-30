import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateAPlanPopupComponent } from './create-a-plan-popup.component';

describe('CreateAPlanPopupComponent', () => {
  let component: CreateAPlanPopupComponent;
  let fixture: ComponentFixture<CreateAPlanPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateAPlanPopupComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateAPlanPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
