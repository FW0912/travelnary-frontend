import { Component, forwardRef, signal } from "@angular/core";
import { BaseInputComponent } from "../base-input/base-input.component";
import { provideNativeDateAdapter } from "@angular/material/core";
import {
	FormBuilder,
	FormControl,
	FormsModule,
	NG_VALUE_ACCESSOR,
	ReactiveFormsModule,
} from "@angular/forms";
import { CommonModule } from "@angular/common";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatFormFieldModule } from "@angular/material/form-field";
import { ErrorMessageWrapperComponent } from "../../error-message-wrapper/error-message-wrapper.component";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { MatInputModule } from "@angular/material/input";

@Component({
	selector: "app-date-input",
	imports: [
		MatFormFieldModule,
		MatDatepickerModule,
		MatInputModule,
		CommonModule,
		FormsModule,
		ReactiveFormsModule,
		ErrorMessageWrapperComponent,
	],
	providers: [
		provideNativeDateAdapter(),
		{
			provide: NG_VALUE_ACCESSOR,
			useExisting: forwardRef(() => DateInputComponent),
			multi: true,
		},
	],
	templateUrl: "./date-input.component.html",
	styleUrl: "./date-input.component.css",
})
export class DateInputComponent extends BaseInputComponent<Date | null> {
	protected date: FormControl<Date | null>;

	constructor(private fb: FormBuilder) {
		super();

		this.date = fb.control<Date | null>(null);
	}

	override writeValue(obj: Date | null): void {
		if (obj !== null) {
			this.date.setValue(obj);
		}
	}

	override registerOnChange(fn: Function): void {
		this.date.valueChanges
			.pipe(takeUntilDestroyed(this.destroyRef))
			.subscribe((x) => fn(x));
	}

	override setDisabledState(isDisabled: boolean): void {
		if (isDisabled) {
			this.date.disable();
		} else {
			this.date.enable();
		}
	}
}
