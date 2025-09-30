import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ErrorMessageWrapperComponent } from './error-message-wrapper.component';

describe('ErrorMessageWrapperComponent', () => {
  let component: ErrorMessageWrapperComponent;
  let fixture: ComponentFixture<ErrorMessageWrapperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ErrorMessageWrapperComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ErrorMessageWrapperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
