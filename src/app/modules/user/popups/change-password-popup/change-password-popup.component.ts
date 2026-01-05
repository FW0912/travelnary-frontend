import { Component, signal, WritableSignal } from "@angular/core";
import { BasePopupComponent } from "../../../base-popup/base-popup.component";
import { BaseFormComponent } from "../../../base-form-page/base-form-page.component";
import {
	FormBuilder,
	FormControl,
	ReactiveFormsModule,
	ValidatorFn,
	Validators,
} from "@angular/forms";
import {
	MatDialogContent,
	MatDialogActions,
	MatDialogRef,
} from "@angular/material/dialog";
import { BorderButtonComponent } from "../../../../shared/components/buttons/border-button/border-button.component";
import { TextInputComponent } from "../../../../shared/components/inputs/text-input/text-input.component";
import { AuthService } from "../../../../core/services/auth/auth.service";
import { SnackbarService } from "../../../../core/services/snackbar/snackbar.service";
import { ChangePasswordDto } from "../../../../core/auth/models/change-password-dto";
import { ESnackbarType } from "../../../../core/models/utils/others/snackbar-type.enum";
import { ButtonComponent } from "../../../../shared/components/buttons/button/button.component";
import { CommonModule } from "@angular/common";

type PasswordTypes = "oldPassword" | "newPassword" | "confirmPassword";

@Component({
	selector: "app-change-password-popup",
	imports: [
		BasePopupComponent,
		MatDialogContent,
		MatDialogActions,
		TextInputComponent,
		ReactiveFormsModule,
		ButtonComponent,
		CommonModule,
	],
	templateUrl: "./change-password-popup.component.html",
	styleUrl: "./change-password-popup.component.css",
})
export class ChangePasswordPopupComponent extends BaseFormComponent {
	protected hiddenPasswordRecord: Record<
		PasswordTypes,
		WritableSignal<boolean>
	> = {
		oldPassword: signal(true),
		newPassword: signal(true),
		confirmPassword: signal(true),
	};

	private readonly confirmPasswordValidator: ValidatorFn = (control) => {
		if (
			this.newPasswordControl &&
			control.value !== this.newPasswordControl.value
		) {
			return {
				confirmPassword: {
					message: "Invalid!",
				},
			};
		}

		return null;
	};

	constructor(
		private fb: FormBuilder,
		private authService: AuthService,
		private snackbarService: SnackbarService,
		private ref: MatDialogRef<ChangePasswordPopupComponent>
	) {
		super();

		this.setFormGroup(
			fb.group({
				oldPassword: fb.control<string>("", [
					Validators.required,
					Validators.minLength(5),
				]),
				newPassword: fb.control<string>("", [
					Validators.required,
					Validators.minLength(5),
				]),
				confirmPassword: fb.control<string>("", [
					Validators.required,
					Validators.minLength(5),
					this.confirmPasswordValidator,
				]),
			})
		);
	}

	protected get oldPasswordControl(): FormControl<string> {
		return this.formGroup.get("oldPassword") as FormControl<string>;
	}

	protected get newPasswordControl(): FormControl<string> {
		return this.formGroup.get("newPassword") as FormControl<string>;
	}

	protected get confirmPasswordControl(): FormControl<string> {
		return this.formGroup.get("confirmPassword") as FormControl<string>;
	}

	protected togglePasswordHidden(passwordType: PasswordTypes): void {
		this.hiddenPasswordRecord[passwordType].update((x) => !x);
	}

	protected changePassword(): void {
		this.submit();

		if (this.formGroup.valid) {
			const body: ChangePasswordDto = {
				oldPassword: this.oldPasswordControl.value,
				newPassword: this.newPasswordControl.value,
				confirmPassword: this.confirmPasswordControl.value,
			};

			this.authService.changePassword(body).subscribe({
				next: () => {
					this.snackbarService.openSnackBar(
						"Password successfully updated.",
						ESnackbarType.INFO
					);
					this.ref.close();
				},
			});
		}
	}
}
