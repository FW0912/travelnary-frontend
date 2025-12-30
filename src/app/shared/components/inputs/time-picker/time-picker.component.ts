import { CommonModule } from "@angular/common";
import {
	ChangeDetectionStrategy,
	Component,
	forwardRef,
	signal,
} from "@angular/core";
import {
	FormBuilder,
	FormControl,
	FormsModule,
	NG_VALUE_ACCESSOR,
	ReactiveFormsModule,
} from "@angular/forms";
import { MatFormFieldModule } from "@angular/material/form-field";
import { ErrorMessageWrapperComponent } from "../../error-message-wrapper/error-message-wrapper.component";
import { MatInputModule } from "@angular/material/input";
import { MatTimepickerModule } from "@angular/material/timepicker";
import { BaseInputComponent } from "../base-input/base-input.component";
import { provideNativeDateAdapter } from "@angular/material/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";

@Component({
	selector: "app-time-picker",
	imports: [
		MatFormFieldModule,
		MatInputModule,
		MatTimepickerModule,
		CommonModule,
		FormsModule,
		ReactiveFormsModule,
		ErrorMessageWrapperComponent,
	],
	providers: [
		provideNativeDateAdapter(),
		{
			provide: NG_VALUE_ACCESSOR,
			useExisting: forwardRef(() => TimePickerComponent),
			multi: true,
		},
	],
	templateUrl: "./time-picker.component.html",
	styleUrl: "./time-picker.component.css",
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TimePickerComponent extends BaseInputComponent<Date | null> {
	protected time: FormControl<Date | null>;
	protected isDisabled = signal<boolean>(false);

	constructor(private fb: FormBuilder) {
		super();

		this.time = fb.control<Date | null>(null);
	}

	override writeValue(obj: Date | null): void {
		if (obj !== null) {
			this.time.setValue(obj);
		}
	}

	override registerOnChange(fn: Function): void {
		this.time.valueChanges
			.pipe(takeUntilDestroyed(this.destroyRef))
			.subscribe((x) => fn(x));
	}

	override setDisabledState(isDisabled: boolean): void {
		this.isDisabled.set(isDisabled);
	}
}
