import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BaseSharedComponent } from './base-shared.component';

describe('BaseSharedComponent', () => {
  let component: BaseSharedComponent;
  let fixture: ComponentFixture<BaseSharedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BaseSharedComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BaseSharedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
