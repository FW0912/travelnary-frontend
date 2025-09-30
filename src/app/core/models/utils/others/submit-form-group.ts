import { FormControl, FormGroup } from "@angular/forms";

export class SubmitFormGroup extends FormGroup<{
	isFormSubmitted: FormControl<boolean | null>;
	formGroup: FormGroup;
}> {
	constructor() {
		super({
			isFormSubmitted: new FormControl<boolean>(false),
			formGroup: new FormGroup({}),
		});
	}
}
