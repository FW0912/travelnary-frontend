import {
	ChangeDetectionStrategy,
	Component,
	computed,
	signal,
} from "@angular/core";
import { BasePopupComponent } from "../../../base-popup/base-popup.component";
import { BaseFormComponent } from "../../../base-form-page/base-form-page.component";
import {
	FormBuilder,
	FormControl,
	ReactiveFormsModule,
	Validators,
} from "@angular/forms";
import {
	MatDialogContent,
	MatDialogActions,
	MatDialogRef,
} from "@angular/material/dialog";
import { TextInputComponent } from "../../../../shared/components/inputs/text-input/text-input.component";
import { AuthService } from "../../../../core/services/auth/auth.service";
import { NavigationService } from "../../../../core/services/navigation/navigation.service";
import { BorderButtonComponent } from "../../../../shared/components/buttons/border-button/border-button.component";
import { TextAreaComponent } from "../../../../shared/components/inputs/text-area/text-area.component";
import { UserImageComponent } from "../../../../shared/components/images/user-image/user-image.component";
import { ErrorMessageWrapperComponent } from "../../../../shared/components/error-message-wrapper/error-message-wrapper.component";
import { DateInputComponent } from "../../../../shared/components/inputs/date-input/date-input.component";
import { ButtonComponent } from "../../../../shared/components/buttons/button/button.component";
import { UpdateProfileDto } from "../../../../core/auth/models/update-profile-dto";
import { SnackbarService } from "../../../../core/services/snackbar/snackbar.service";
import { ESnackbarType } from "../../../../core/models/utils/others/snackbar-type.enum";
import { ImageService } from "../../../image/services/image.service";
import { Observable, switchMap } from "rxjs";
import { ApiResponse } from "../../../../core/models/api/api-response";
import { UserProfile } from "../../../../core/models/domain/user/user-profile";

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
		DateInputComponent,
		ButtonComponent,
	],
	templateUrl: "./settings-popup.component.html",
	styleUrl: "./settings-popup.component.css",
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingsPopupComponent extends BaseFormComponent {
	protected isDataFetched = signal<boolean>(false);
	protected username = signal<string>("");
	protected profileUrl = signal<string | null>(null);

	constructor(
		private fb: FormBuilder,
		private authService: AuthService,
		private imageService: ImageService,
		private snackbarService: SnackbarService,
		private ref: MatDialogRef<SettingsPopupComponent>
	) {
		super();
	}

	protected get emailControl(): FormControl<string> {
		return this.formGroup.get("email")! as FormControl;
	}

	protected get fullNameControl(): FormControl<string> {
		return this.formGroup.get("fullName")! as FormControl;
	}

	protected get descriptionControl(): FormControl<string> {
		return this.formGroup.get("description")! as FormControl;
	}

	protected get profilePictureControl(): FormControl<File | null> {
		return this.formGroup.get("profilePicture")! as FormControl;
	}

	protected get dobControl(): FormControl<Date | null> {
		return this.formGroup.get("dob")! as FormControl;
	}

	protected get genderControl(): FormControl<string | null> {
		return this.formGroup.get("gender")! as FormControl;
	}

	ngOnInit(): void {
		this.fetchData();
	}

	private fetchData(): void {
		const userData = this.authService.getRequiredUserData();

		if (!userData.userId || !userData.username) {
			this.ref.close();
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
			this.formGroup
				.get("profilePicture")!
				.setValue(target.files.item(0)!);

			const fileReader: FileReader = new FileReader();

			fileReader.onload = (event) => {
				this.profileUrl.set(event.target!.result as string);
			};

			fileReader.readAsDataURL(target.files.item(0)!);
		} else {
			this.formGroup.get("profilePicture")!.setValue(null);
			this.profileUrl.set(null);
		}
	}

	private constructUpdateProfileDto(
		profilePictureUrl: string | null
	): UpdateProfileDto {
		return {
			email: this.emailControl.value,
			fullName:
				this.fullNameControl.value.length !== 0
					? this.fullNameControl.value
					: null,
			description:
				this.descriptionControl.value.length !== 0
					? this.descriptionControl.value
					: null,
			birthday: this.dobControl.value?.toISOString() ?? null,
			gender: this.genderControl.value,
			profilePicture: profilePictureUrl,
		};
	}

	protected updateSettings(): void {
		this.submit();

		if (this.formGroup.valid) {
			if (this.profileUrl() !== null) {
				if (this.profilePictureControl.value !== null) {
					this.imageService
						.upload(this.profilePictureControl.value)
						.pipe(
							switchMap((x) => {
								const body: UpdateProfileDto =
									this.constructUpdateProfileDto(
										x.data.fileUrl
									);

								return this.authService.updateProfile(body);
							})
						)
						.subscribe({
							next: () => {
								this.snackbarService.openSnackBar(
									"Profile successfully updated.",
									ESnackbarType.INFO
								);
								this.ref.close();
							},
						});
				} else {
					const body: UpdateProfileDto =
						this.constructUpdateProfileDto(this.profileUrl());
					this.authService.updateProfile(body).subscribe({
						next: () => {
							this.snackbarService.openSnackBar(
								"Profile successfully updated.",
								ESnackbarType.INFO
							);
							this.ref.close();
						},
					});
				}
			} else {
				const body: UpdateProfileDto =
					this.constructUpdateProfileDto(null);
				this.authService.updateProfile(body).subscribe({
					next: () => {
						this.snackbarService.openSnackBar(
							"Profile successfully updated.",
							ESnackbarType.INFO
						);
						this.ref.close();
					},
				});
			}
		}
	}
}
