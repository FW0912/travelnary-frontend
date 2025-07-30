import { Component } from "@angular/core";
import { ButtonComponent } from "../../../../shared/components/buttons/button/button.component";
import { TextInputComponent } from "../../../../shared/components/inputs/text-input/text-input.component";

@Component({
	selector: "app-register-page",
	imports: [TextInputComponent, ButtonComponent],
	templateUrl: "./register-page.component.html",
	styleUrl: "./register-page.component.css",
})
export class RegisterPageComponent {
	protected username: string = "";
	protected fullName: string = "";
	protected email: string = "";
	protected password: string = "";
	protected isPasswordHidden: boolean = true;

	protected togglePasswordHidden(): void {
		this.isPasswordHidden = !this.isPasswordHidden;
	}
}
