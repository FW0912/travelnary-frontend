import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import {
	ChangeDetectionStrategy,
	Component,
	DestroyRef,
	forwardRef,
	input,
	Input,
	model,
	signal,
} from "@angular/core";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { provideNativeDateAdapter } from "@angular/material/core";
import {
	FormBuilder,
	FormControl,
	FormGroup,
	FormsModule,
	NG_VALUE_ACCESSOR,
	ReactiveFormsModule,
} from "@angular/forms";
import { BaseInputComponent } from "../base-input/base-input.component";
import { CommonModule } from "@angular/common";
import { ErrorMessageWrapperComponent } from "../../error-message-wrapper/error-message-wrapper.component";

@Component({
	selector: "app-date-input",
	imports: [
		MatFormFieldModule,
		MatDatepickerModule,
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
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DateInputComponent extends BaseInputComponent<{
	start: Date | null;
	end: Date | null;
} | null> {
	protected dateRange: FormGroup<{
		start: FormControl<Date | null>;
		end: FormControl<Date | null>;
	}>;
	protected isDisabled = signal<boolean>(false);

	constructor(private fb: FormBuilder) {
		super();

		this.dateRange = fb.group({
			start: fb.control<Date | null>(null),
			end: fb.control<Date | null>(null),
		});
	}

	override writeValue(
		obj: { start: Date | null; end: Date | null } | null
	): void {
		if (obj !== null) {
			this.dateRange.setValue(obj);
		}
	}

	override registerOnChange(fn: Function): void {
		this.dateRange.valueChanges
			.pipe(takeUntilDestroyed(this.destroyRef))
			.subscribe((x) => fn(x));
	}

	override setDisabledState(isDisabled: boolean): void {
		this.isDisabled.set(isDisabled);
	}
}
