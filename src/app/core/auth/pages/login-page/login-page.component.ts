import { MatCheckboxModule } from "@angular/material/checkbox";
import { ChangeDetectionStrategy, Component, signal } from "@angular/core";
import { TextInputComponent } from "../../../../shared/components/inputs/text-input/text-input.component";
import { ButtonComponent } from "../../../../shared/components/buttons/button/button.component";
import { SnackbarService } from "../../../services/snackbar/snackbar.service";
import { ESnackbarType } from "../../../models/utils/others/snackbar-type.enum";
import {
	FormBuilder,
	FormGroup,
	FormsModule,
	ReactiveFormsModule,
	Validators,
} from "@angular/forms";
import { CommonModule } from "@angular/common";
import { BaseFormComponent } from "../../../../modules/base-form-page/base-form-page.component";
import { LinkComponent } from "../../../../shared/components/link/link.component";

@Component({
	selector: "app-login-page",
	imports: [
		TextInputComponent,
		ButtonComponent,
		MatCheckboxModule,
		CommonModule,
		LinkComponent,
		FormsModule,
		ReactiveFormsModule,
	],
	templateUrl: "./login-page.component.html",
	styleUrl: "./login-page.component.css",
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginPageComponent extends BaseFormComponent {
	protected isPasswordHidden = signal<boolean>(true);
	protected rememberMe = signal<boolean>(false);

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
			})
		);
	}

	protected togglePasswordHidden(): void {
		this.isPasswordHidden.update((state) => !state);
	}

	protected changeRememberMe(event: any): void {
		this.rememberMe.set(event.checked);
	}

	protected login(): void {
		this.submit();

		if (this.formGroup.valid) {
			console.log(this.formGroup);
			console.log(this.rememberMe());
		}
	}
}
