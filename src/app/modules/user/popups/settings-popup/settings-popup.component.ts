import { Component, computed, signal } from "@angular/core";
import { BasePopupComponent } from "../../../base-popup/base-popup.component";
import { BaseFormComponent } from "../../../base-form-page/base-form-page.component";
import {
	FormBuilder,
	FormControl,
	ReactiveFormsModule,
	Validators,
} from "@angular/forms";
import { MatDialogContent, MatDialogActions } from "@angular/material/dialog";
import { TextInputComponent } from "../../../../shared/components/inputs/text-input/text-input.component";
import { AuthService } from "../../../../core/services/auth/auth.service";
import { NavigationService } from "../../../../core/services/navigation/navigation.service";
import { BorderButtonComponent } from "../../../../shared/components/buttons/border-button/border-button.component";
import { TextAreaComponent } from "../../../../shared/components/inputs/text-area/text-area.component";
import { UserImageComponent } from "../../../../shared/components/images/user-image/user-image.component";
import { ErrorMessageWrapperComponent } from "../../../../shared/components/error-message-wrapper/error-message-wrapper.component";

@Component({
	selector: "app-settings-popup",
	imports: [
		BasePopupComponent,
		MatDialogContent,
		MatDialogActions,
		TextInputComponent,
		ReactiveFormsModule,
		BorderButtonComponent,
		TextAreaComponent,
		UserImageComponent,
		ErrorMessageWrapperComponent,
	],
	templateUrl: "./settings-popup.component.html",
	styleUrl: "./settings-popup.component.css",
})
export class SettingsPopupComponent extends BaseFormComponent {
	protected isDataFetched = signal<boolean>(false);
	protected username = signal<string>("");
	protected profileUrl = signal<string | null>(null);

	constructor(
		private fb: FormBuilder,
		private authService: AuthService,
		private navService: NavigationService
	) {
		super();
	}

	ngOnInit(): void {
		this.fetchData();
	}

	private fetchData(): void {
		const userData = this.authService.getRequiredUserData();

		if (!userData.userId || !userData.username) {
			this.navService.back();
			return;
		}

		this.username.set(userData.username);

		this.authService.getUserProfile(userData.userId).subscribe({
			next: (x) => {
				if (x.data.profileUrl) {
					this.profileUrl.set(x.data.profileUrl);
				}

				this.setFormGroup(
					this.fb.group({
						email: this.fb.control<string>(x.data.email, [
							Validators.required,
							Validators.email,
						]),
						fullName: this.fb.control<string>(x.data.fullName),
						description: this.fb.control<string>(
							x.data.bioDescription
						),
						profilePicture: this.fb.control<File | null>(null),
						dob: this.fb.control<Date | null>(
							x.data.dob ? new Date(x.data.dob) : null
						),
						gender: this.fb.control<string>(x.data.gender),
					})
				);

				this.isDataFetched.set(true);
			},
		});
	}

	protected onUploadFile(event: Event): void {
		const target = event.target! as HTMLInputElement;

		if (target.files !== null && target.files.item(0) !== null) {
			this.formGroup.get("photo")!.setValue(target.files.item(0)!);

			const fileReader: FileReader = new FileReader();

			fileReader.onload = (event) => {
				this.profileUrl.set(event.target!.result as string);
			};

			fileReader.readAsDataURL(target.files.item(0)!);
		} else {
			this.formGroup.get("photo")!.setValue(null);
			this.profileUrl.set(null);
		}
	}
}
