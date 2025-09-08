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
				!errors.hasOwnProperty("message"))
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

		return errors["message"];
	}

	transform(
		errors: ValidationErrors | null,
		customErrorName?: string,
		lengthUnit?: string
	): string {
		if (errors === null) {
			return "";
		}

		if (this.hasErrorMessage(errors)) {
			return this.getErrorMessage(errors, lengthUnit);
		}

		if (customErrorName) {
			if (this.hasErrorMessage(errors[customErrorName])) {
				return this.getErrorMessage(
					errors[customErrorName],
					lengthUnit
				);
			}
		} else {
			const customError: Object | undefined = Object.keys(errors).find(
				(x) =>
					x != "required" &&
					x != "min" &&
					x != "max" &&
					x != "minlength" &&
					x != "maxlength"
			);

			if (customError) {
				if (this.hasErrorMessage(customError)) {
					return this.getErrorMessage(customError);
				}
			}
		}

		return "";
	}
}
