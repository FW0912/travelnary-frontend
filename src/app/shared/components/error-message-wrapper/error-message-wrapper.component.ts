import {
	ChangeDetectionStrategy,
	Component,
	input,
	ViewEncapsulation,
} from "@angular/core";
import { ParseErrorMessagePipe } from "../../pipes/parse-error-message/parse-error-message.pipe";
import { fadeInOutAnimation } from "../../animations/fade-in-out.animation";
import { AbstractControl, NgControl, ValidationErrors } from "@angular/forms";
import { CommonModule } from "@angular/common";

@Component({
	selector: "app-error-message-wrapper",
	imports: [ParseErrorMessagePipe, CommonModule],
	templateUrl: "./error-message-wrapper.component.html",
	styleUrl: "./error-message-wrapper.component.css",
	changeDetection: ChangeDetectionStrategy.OnPush,
	animations: [fadeInOutAnimation],
	encapsulation: ViewEncapsulation.None,
})
export class ErrorMessageWrapperComponent {
	public errors = input.required<ValidationErrors | null>();
	public isControlTouched = input.required<boolean | null>();
	public isFormSubmitted = input.required<boolean>();
}
