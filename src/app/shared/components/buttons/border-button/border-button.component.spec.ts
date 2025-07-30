import { ComponentFixture, TestBed } from "@angular/core/testing";

import { BorderButtonComponent } from "./border-button.component";

describe("BorderButton", () => {
	let component: BorderButtonComponent;
	let fixture: ComponentFixture<BorderButtonComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [BorderButtonComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(BorderButtonComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it("should create", () => {
		expect(component).toBeTruthy();
	});
});
