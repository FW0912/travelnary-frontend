import { AsyncPipe, CommonModule } from "@angular/common";
import {
	ChangeDetectionStrategy,
	ChangeDetectorRef,
	Component,
	computed,
	DestroyRef,
	effect,
	forwardRef,
	Injector,
	input,
	Input,
	model,
	Optional,
	output,
	Self,
	signal,
} from "@angular/core";
import {
	FormsModule,
	NG_VALUE_ACCESSOR,
	NgControl,
	ReactiveFormsModule,
} from "@angular/forms";
import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { Observable, take, takeUntil } from "rxjs";
import { IValueOption } from "../../../models/utils/value-option";
import { BaseInputComponent } from "../base-input/base-input.component";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { ParseErrorMessagePipe } from "../../../pipes/parse-error-message.pipe";
import { fadeInOutAnimation } from "../../../animations/fade-in-out.animation";

@Component({
	selector: "app-text-input",
	imports: [
		CommonModule,
		FormsModule,
		ReactiveFormsModule,
		MatAutocompleteModule,
		AsyncPipe,
		ParseErrorMessagePipe,
	],
	templateUrl: "./text-input.component.html",
	styleUrl: "./text-input.component.css",
	changeDetection: ChangeDetectionStrategy.OnPush,
	animations: [fadeInOutAnimation],
	providers: [
		{
			provide: NG_VALUE_ACCESSOR,
			useExisting: forwardRef(() => TextInputComponent),
			multi: true,
		},
	],
})
export class TextInputComponent extends BaseInputComponent<string> {
	public id = input.required<string>();
	public name = input.required<string>();
	public placeholder = input.required<string>();
	public type = input<"text" | "password" | "email" | "number">("text");
	protected class = computed(() => {
		var baseClasses =
			"w-full border-2 not-dark:text-input placeholder:text-placeholder transition-all rounded-sm px-2 py-1 text-sm outline-sky-400 border-gray-300";
		const extraClasses = this.extraClasses();

		if (extraClasses && extraClasses.length > 0) {
			baseClasses = baseClasses.concat(" ", extraClasses);
		}

		return baseClasses;
	});
	public isHidden = input<boolean>(false);
	public autoCompleteOptionList = input<Observable<
		Array<IValueOption>
	> | null>(null);
	public formSubmittedObservable = input<Observable<void> | null>(null);

	protected input = signal<string>("");
	protected isDisabled = signal<boolean>(false);
	protected isFormSubmitted = signal<boolean>(false);

	override writeValue(obj: string): void {
		this.input.set(obj);
	}

	override setDisabledState(isDisabled: boolean): void {
		this.isDisabled.set(isDisabled);
	}

	constructor(private destroyRef: DestroyRef) {
		super();

		effect(() => {
			const formSubmittedObservable = this.formSubmittedObservable();

			if (formSubmittedObservable != null) {
				formSubmittedObservable
					.pipe(take(1), takeUntilDestroyed(destroyRef))
					.subscribe(() => {
						this.isFormSubmitted.set(true);
					});
			}
		});
	}
}
