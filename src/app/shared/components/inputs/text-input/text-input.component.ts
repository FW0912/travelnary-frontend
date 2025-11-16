import { AsyncPipe, CommonModule } from "@angular/common";
import {
	ChangeDetectionStrategy,
	Component,
	computed,
	forwardRef,
	input,
	signal,
} from "@angular/core";
import {
	FormsModule,
	NG_VALUE_ACCESSOR,
	ReactiveFormsModule,
} from "@angular/forms";
import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { Observable } from "rxjs";
import { IValueOption } from "../../../models/utils/value-option";
import { BaseInputComponent } from "../base-input/base-input.component";
import { fadeInOutAnimation } from "../../../animations/fade-in-out.animation";
import { ErrorMessageWrapperComponent } from "../../error-message-wrapper/error-message-wrapper.component";
import { BlurOnEnterDirective } from "../../../directives/blur-on-enter/blur-on-enter.directive";

@Component({
	selector: "app-text-input",
	imports: [
		CommonModule,
		FormsModule,
		ReactiveFormsModule,
		MatAutocompleteModule,
		AsyncPipe,
		ErrorMessageWrapperComponent,
		BlurOnEnterDirective,
	],
	templateUrl: "./text-input.component.html",
	styleUrl: "./text-input.component.css",
	changeDetection: ChangeDetectionStrategy.OnPush,
	animations: [fadeInOutAnimation],
	host: { class: "w-full" },
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
			"w-full border-2 not-dark:text-input placeholder:text-placeholder transition-all rounded-sm px-2 py-1 text-sm outline-sky-400 border-input-border";
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

	protected value = signal<string>("");
	protected isDisabled = signal<boolean>(false);

	override writeValue(obj: string): void {
		this.value.set(obj);
	}

	override setDisabledState(isDisabled: boolean): void {
		this.isDisabled.set(isDisabled);
	}

	constructor() {
		super();
	}
}
