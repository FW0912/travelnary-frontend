import { ChangeDetectionStrategy, Component } from "@angular/core";
import { AbstractControl, FormControl, FormGroup } from "@angular/forms";
import { Subject } from "rxjs";
import { SubmitFormGroup } from "../../core/models/utils/others/submit-form-group";

@Component({
	selector: "app-base-form",
	imports: [],
	template: "",
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BaseFormComponent {
	protected baseFormGroup: SubmitFormGroup = new SubmitFormGroup();

	protected get formGroup(): FormGroup {
		return this.baseFormGroup.controls.formGroup;
	}

	protected get isFormSubmitted(): FormControl {
		return this.baseFormGroup.controls.isFormSubmitted;
	}

	protected setFormGroup(formGroup: FormGroup) {
		this.baseFormGroup.setControl("formGroup", formGroup);
	}

	protected submit(): void {
		this.baseFormGroup.controls.isFormSubmitted.patchValue(true);
	}
}
