import { MatCheckboxModule } from "@angular/material/checkbox";
import { Component } from "@angular/core";
import { TextInputComponent } from "../../../../shared/components/inputs/text-input/text-input.component";
import { ButtonComponent } from "../../../../shared/components/buttons/button/button.component";
import { SnackbarService } from "../../../services/snackbar/snackbar.service";
import { ESnackbarType } from "../../../models/utils/others/snackbar-type-enum";
import { FormsModule } from "@angular/forms";

@Component({
	selector: "app-login-page",
	imports: [TextInputComponent, ButtonComponent, MatCheckboxModule],
	templateUrl: "./login-page.component.html",
	styleUrl: "./login-page.component.css",
})
export class LoginPageComponent {
	protected username: string = "";
	protected password: string = "";
	protected isPasswordHidden: boolean = true;
	protected rememberMe: boolean = false;

	constructor(private snackbarService: SnackbarService) {}

	protected togglePasswordHidden(): void {
		this.isPasswordHidden = !this.isPasswordHidden;
	}

	protected changeRememberMe(event: any): void {
		this.rememberMe = event.checked;
	}

	protected validateLogin(): boolean {
		if (this.username.length < 5) {
			this.snackbarService.openSnackBar(
				"Username must be more than 5 characters!",
				ESnackbarType.ERROR
			);
			return false;
		}

		if (this.password.length < 5) {
			this.snackbarService.openSnackBar(
				"Password must be more than 5 characters!",
				ESnackbarType.ERROR
			);
			return false;
		}

		return true;
	}

	protected login(): void {
		if (this.validateLogin()) {
			console.log(this.username);
			console.log(this.password);
			console.log(this.rememberMe);
		}
	}
}
