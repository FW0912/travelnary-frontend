import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DestinationSearchComponent } from './destination-search.component';

describe('DestinationSearchComponent', () => {
  let component: DestinationSearchComponent;
  let fixture: ComponentFixture<DestinationSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DestinationSearchComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DestinationSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
