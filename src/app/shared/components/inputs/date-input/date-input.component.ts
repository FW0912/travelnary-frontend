import {
	ChangeDetectionStrategy,
	Component,
	input,
	Input,
	model,
} from "@angular/core";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { provideNativeDateAdapter } from "@angular/material/core";
import { FormsModule } from "@angular/forms";
import { BaseInputComponent } from "../base-input/base-input.component";

@Component({
	selector: "app-date-input",
	imports: [MatFormFieldModule, MatDatepickerModule, FormsModule],
	providers: [provideNativeDateAdapter()],
	templateUrl: "./date-input.component.html",
	styleUrl: "./date-input.component.css",
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DateInputComponent extends BaseInputComponent<Date> {
	public startDate = model.required<Date | null>();
	public endDate = model.required<Date | null>();

	override writeValue(obj: Date): void {
		this.startDate.set(obj);
	}

	override setDisabledState(isDisabled: boolean): void {}
}
