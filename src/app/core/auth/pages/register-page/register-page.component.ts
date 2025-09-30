import { ChangeDetectionStrategy, Component, signal } from "@angular/core";
import { ButtonComponent } from "../../../../shared/components/buttons/button/button.component";
import { TextInputComponent } from "../../../../shared/components/inputs/text-input/text-input.component";
import { SnackbarService } from "../../../services/snackbar/snackbar.service";
import { ESnackbarType } from "../../../models/utils/others/snackbar-type.enum";
import { BaseFormComponent } from "../../../../modules/base-form-page/base-form-page.component";
import { LinkComponent } from "../../../../shared/components/link/link.component";
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";

@Component({
	selector: "app-register-page",
	imports: [
		TextInputComponent,
		ButtonComponent,
		LinkComponent,
		ReactiveFormsModule,
	],
	templateUrl: "./register-page.component.html",
	styleUrl: "./register-page.component.css",
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegisterPageComponent extends BaseFormComponent {
	protected isPasswordHidden = signal<boolean>(true);

	constructor(private fb: FormBuilder) {
		super();
	}

	ngOnInit(): void {
		this.setFormGroup(
			this.fb.group({
				username: this.fb.control("", [
					Validators.required,
					Validators.minLength(5),
				]),
				password: this.fb.control("", [
					Validators.required,
					Validators.minLength(5),
				]),
				fullName: this.fb.control(""),
				email: this.fb.control("", [
					Validators.required,
					Validators.email,
				]),
			})
		);
	}

	protected togglePasswordHidden(): void {
		this.isPasswordHidden.update((state) => !state);
	}

	protected register(): void {
		this.submit();

		if (this.formGroup.valid) {
			console.log(this.formGroup);
		}
	}
}
