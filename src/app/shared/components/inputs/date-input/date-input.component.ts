import { Component, Input, model } from "@angular/core";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { provideNativeDateAdapter } from "@angular/material/core";
import { FormsModule } from "@angular/forms";

@Component({
	selector: "app-date-input",
	imports: [MatFormFieldModule, MatDatepickerModule, FormsModule],
	providers: [provideNativeDateAdapter()],
	templateUrl: "./date-input.component.html",
	styleUrl: "./date-input.component.css",
})
export class DateInputComponent {
	public startDate = model.required<Date | null>();
	public endDate = model.required<Date | null>();
	@Input({ required: false }) public extraClasses: string = "";
}
