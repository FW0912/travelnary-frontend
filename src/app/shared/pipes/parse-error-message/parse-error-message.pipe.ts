import { Pipe, PipeTransform } from "@angular/core";
import { ValidationErrors, Validators } from "@angular/forms";

@Pipe({
	name: "parseErrorMessage",
})
export class ParseErrorMessagePipe implements PipeTransform {
	private hasErrorMessage(errors: ValidationErrors): boolean {
		if (
			errors === null ||
			(!errors.hasOwnProperty("required") &&
				!errors.hasOwnProperty("min") &&
				!errors.hasOwnProperty("max") &&
				!errors.hasOwnProperty("minlength") &&
				!errors.hasOwnProperty("maxlength") &&
				!errors.hasOwnProperty("email"))
		) {
			return false;
		}

		return true;
	}

	private getErrorMessage(
		errors: ValidationErrors,
		lengthUnit?: string
	): string {
		if (errors.hasOwnProperty("required")) {
			return "Required (*)";
		}

		if (errors.hasOwnProperty("min")) {
			return `Min. ${errors["min"].min}`;
		}

		if (errors.hasOwnProperty("max")) {
			return `Max. ${errors["max"].max}`;
		}

		if (errors.hasOwnProperty("minlength")) {
			return `Min. ${errors["minlength"].requiredLength}${
				lengthUnit ? ` ${lengthUnit}` : ""
			}`;
		}

		if (errors.hasOwnProperty("maxlength")) {
			return `Max. ${errors["maxlength"].requiredLength}${
				lengthUnit ? ` ${lengthUnit}` : ""
			}`;
		}

		if (errors.hasOwnProperty("email")) {
			return `Invalid email!`;
		}

		return errors["message"] ?? "Unknown Error";
	}

	transform(errors: ValidationErrors | null, lengthUnit?: string): string {
		if (errors === null) {
			return "";
		}

		if (this.hasErrorMessage(errors)) {
			return this.getErrorMessage(errors, lengthUnit);
		}

		const customError: Object = Object.values(errors)[0];

		if (customError && customError.hasOwnProperty("message")) {
			return this.getErrorMessage(customError, lengthUnit);
		}

		return "";
	}
}
