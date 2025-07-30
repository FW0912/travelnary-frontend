import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BrowsePlansPageComponent } from './browse-plans-page.component';

describe('BrowsePlansPageComponent', () => {
  let component: BrowsePlansPageComponent;
  let fixture: ComponentFixture<BrowsePlansPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BrowsePlansPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BrowsePlansPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
