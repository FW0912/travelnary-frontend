import { Component, computed, forwardRef, input, signal } from "@angular/core";
import {
	FormsModule,
	NG_VALUE_ACCESSOR,
	ReactiveFormsModule,
} from "@angular/forms";
import { BaseInputComponent } from "../base-input/base-input.component";
import { CommonModule } from "@angular/common";
import { TextFieldModule } from "@angular/cdk/text-field";
import { fadeInOutAnimation } from "../../../animations/fade-in-out.animation";
import { ErrorMessageWrapperComponent } from "../../error-message-wrapper/error-message-wrapper.component";
import { BlurOnEnterDirective } from "../../../directives/blur-on-enter/blur-on-enter.directive";

@Component({
	selector: "app-text-area",
	imports: [
		CommonModule,
		FormsModule,
		ReactiveFormsModule,
		TextFieldModule,
		ErrorMessageWrapperComponent,
		BlurOnEnterDirective,
	],
	templateUrl: "./text-area.component.html",
	styleUrl: "./text-area.component.css",
	providers: [
		{
			provide: NG_VALUE_ACCESSOR,
			useExisting: forwardRef(() => TextAreaComponent),
			multi: true,
		},
	],
	animations: [fadeInOutAnimation],
})
export class TextAreaComponent extends BaseInputComponent<string> {
	public id = input.required<string>();
	public name = input.required<string>();
	public placeholder = input.required<string>();
	public minRows = input<number>(3);
	public maxRows = input<number>(8);
	protected class = computed(() => {
		var baseClasses =
			"w-[calc(100%-1.1rem)] border-2 not-dark:text-input placeholder:text-placeholder transition-all rounded-sm px-2 py-1 text-sm outline-sky-400 border-gray-300";
		const extraClasses = this.extraClasses();

		if (extraClasses && extraClasses.length > 0) {
			baseClasses = baseClasses.concat(" ", extraClasses);
		}

		return baseClasses;
	});
	public isHidden = input<boolean>(false);

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
