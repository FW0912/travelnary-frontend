import { ValidatorFn } from "@angular/forms";

export class DateValidators {
	public static validateDateRange: ValidatorFn = (control) => {
		if (control.value === null) {
			return null;
		}

		if (
			!control.value.hasOwnProperty("start") ||
			!control.value.hasOwnProperty("end")
		) {
			throw Error(
				"DateRangeValidator Error: Control value must have 'start' and 'end'!"
			);
		}

		if (
			(control.value.start === null && control.value.end !== null) ||
			(control.value.start !== null && control.value.end === null)
		) {
			return {
				dateRange: {
					message: "Must be filled together!",
				},
			};
		}

		if (control.value.start >= control.value.end) {
			return {
				dateRange: {
					message: "End date must be greater!",
				},
			};
		}

		return null;
	};
}
