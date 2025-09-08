import { ChangeDetectionStrategy, Component, signal } from "@angular/core";
import { ButtonComponent } from "../../../../shared/components/buttons/button/button.component";
import { TextInputComponent } from "../../../../shared/components/inputs/text-input/text-input.component";
import { SnackbarService } from "../../../services/snackbar/snackbar.service";
import { ESnackbarType } from "../../../models/utils/others/snackbar-type.enum";
import { BaseFormPageComponent } from "../../../../modules/base-form-page/base-form-page.component";
import { LinkComponent } from "../../../../shared/components/link/link.component";

@Component({
	selector: "app-register-page",
	imports: [TextInputComponent, ButtonComponent, LinkComponent],
	templateUrl: "./register-page.component.html",
	styleUrl: "./register-page.component.css",
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegisterPageComponent extends BaseFormPageComponent {
	protected username = signal<string>("");
	protected fullName = signal<string>("");
	protected email = signal<string>("");
	protected password = signal<string>("");
	protected isPasswordHidden = signal<boolean>(true);

	constructor() {
		super();
	}

	protected togglePasswordHidden(): void {
		this.isPasswordHidden.update((state) => !state);
	}

	protected validateRegister(): boolean {
		if (this.username().length < 5) {
			return false;
		}

		if (this.password().length < 5) {
			return false;
		}

		return true;
	}

	protected register(): void {
		this.submit();

		if (this.validateRegister()) {
			console.log(this.username());
			console.log(this.fullName());
			console.log(this.email());
			console.log(this.password());
		}
	}
}
