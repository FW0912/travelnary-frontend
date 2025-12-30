import { Component, Inject, signal } from "@angular/core";
import {
	FormBuilder,
	FormControl,
	ReactiveFormsModule,
	Validators,
} from "@angular/forms";
import {
	MatDialogContent,
	MatDialogActions,
	MAT_DIALOG_DATA,
	MatDialogRef,
} from "@angular/material/dialog";
import { ButtonComponent } from "../../../../shared/components/buttons/button/button.component";
import { DropdownComponent } from "../../../../shared/components/dropdowns/dropdown/dropdown.component";
import { TextAreaComponent } from "../../../../shared/components/inputs/text-area/text-area.component";
import { TextInputComponent } from "../../../../shared/components/inputs/text-input/text-input.component";
import { BasePopupComponent } from "../../../base-popup/base-popup.component";
import { ESnackbarType } from "../../../../core/models/utils/others/snackbar-type.enum";
import { SnackbarService } from "../../../../core/services/snackbar/snackbar.service";
import { LocationCategory } from "../../../../shared/enums/location-category";
import { IValueOption } from "../../../../shared/models/utils/value-option";
import { GeneralUtils } from "../../../../shared/utils/general-utils";
import { BaseFormComponent } from "../../../base-form-page/base-form-page.component";
import { TimePickerComponent } from "../../../../shared/components/inputs/time-picker/time-picker.component";
import { ErrorMessageWrapperComponent } from "../../../../shared/components/error-message-wrapper/error-message-wrapper.component";
import { LocationService } from "../../services/location.service";
import { ImageService } from "../../../image/services/image.service";
import { ModifyLocationDto } from "../../models/modify-location-dto";
import { BorderButtonComponent } from "../../../../shared/components/buttons/border-button/border-button.component";
import { Observable, switchMap } from "rxjs";
import { ApiResponse } from "../../../../core/models/api/api-response";
import { DatePipe } from "@angular/common";
import { UploadImageDto } from "../../../image/models/upload-image-dto";

@Component({
	selector: "app-add-custom-location-popup",
	imports: [
		BasePopupComponent,
		MatDialogContent,
		MatDialogActions,
		DropdownComponent,
		ButtonComponent,
		TextInputComponent,
		TextAreaComponent,
		ReactiveFormsModule,
		TimePickerComponent,
		ErrorMessageWrapperComponent,
		BorderButtonComponent,
	],
	providers: [DatePipe],
	templateUrl: "./add-custom-location-popup.component.html",
	styleUrl: "./add-custom-location-popup.component.css",
})
export class AddCustomLocationPopupComponent extends BaseFormComponent {
	private planId: string | null = null;
	protected currencyName: string | null = null;
	private day: number | null = null;
	private lastSortOrder: number | null = null;
	private editorToken: string | null = null;
	protected locationCategoryOptionList = signal<Array<IValueOption>>(
		new Array()
	);
	protected photoUrl = signal<string | null>(null);

	constructor(
		private ref: MatDialogRef<AddCustomLocationPopupComponent>,
		@Inject(MAT_DIALOG_DATA)
		private data: {
			planId: string;
			currencyName: string;
			day: number;
			lastSortOrder: number;
			editorToken: string | null;
		},
		private snackbarService: SnackbarService,
		private imageService: ImageService,
		private locationService: LocationService,
		private datePipe: DatePipe,
		private fb: FormBuilder
	) {
		super();

		if (!data) {
			snackbarService.openSnackBar(
				"Can't get data!",
				ESnackbarType.ERROR
			);
			ref.close();
			return;
		}

		if (!data.planId) {
			snackbarService.openSnackBar(
				"Can't get Plan Id!",
				ESnackbarType.ERROR
			);
			ref.close();
			return;
		}

		if (!data.currencyName) {
			snackbarService.openSnackBar(
				"Can't get Currency Name!",
				ESnackbarType.ERROR
			);
			ref.close();
			return;
		}

		if (!data.day) {
			snackbarService.openSnackBar("Can't get Day!", ESnackbarType.ERROR);
			ref.close();
			return;
		}

		if (data.lastSortOrder === undefined) {
			snackbarService.openSnackBar(
				"Can't get last sort order!",
				ESnackbarType.ERROR
			);
			ref.close();
			return;
		}

		if (data.editorToken === undefined) {
			snackbarService.openSnackBar(
				"Can't get Editor token!",
				ESnackbarType.ERROR
			);
			ref.close();
			return;
		}

		this.planId = data.planId;
		this.currencyName = data.currencyName;
		this.day = data.day;
		this.lastSortOrder = data.lastSortOrder;
		this.editorToken = data.editorToken;

		this.setFormGroup(
			fb.group({
				category: fb.control<IValueOption | null>(null, [
					Validators.required,
				]),
				name: fb.control<string>("", [
					Validators.required,
					Validators.minLength(5),
				]),
				address: fb.control<string>("", [Validators.required]),
				photo: fb.control<File | null>(null),
				notes: fb.control<string>(""),
				time: fb.control<Date | null>(null),
				cost: fb.control<number | null>(null),
			})
		);
	}

	protected get categoryControl(): FormControl<IValueOption | null> {
		return this.formGroup.get("category")! as FormControl;
	}

	protected get nameControl(): FormControl<string> {
		return this.formGroup.get("name")! as FormControl;
	}

	protected get addressControl(): FormControl<string> {
		return this.formGroup.get("address")! as FormControl;
	}

	protected get photoControl(): FormControl<File | null> {
		return this.formGroup.get("photo")! as FormControl;
	}

	protected get notesControl(): FormControl<string> {
		return this.formGroup.get("notes")! as FormControl;
	}

	protected get timeControl(): FormControl<Date | null> {
		return this.formGroup.get("time")! as FormControl;
	}

	protected get costControl(): FormControl<number | null> {
		return this.formGroup.get("cost")! as FormControl;
	}

	ngOnInit(): void {
		this.locationService.getAllLocationCategories().subscribe({
			next: (x) => {
				this.locationCategoryOptionList.set(
					x.data.map((y) => {
						return {
							id: y.id,
							value: y.name,
						};
					})
				);
			},
		});
	}

	protected onCategorySelected(category: IValueOption | null) {
		this.categoryControl.setValue(category);
	}

	protected onUploadFile(event: Event): void {
		const target = event.target! as HTMLInputElement;

		if (target.files !== null && target.files.item(0) !== null) {
			this.photoControl.setValue(target.files.item(0)!);

			const fileReader: FileReader = new FileReader();

			fileReader.onload = (event) => {
				this.photoUrl.set(event.target!.result as string);
			};

			fileReader.readAsDataURL(target.files.item(0)!);
		} else {
			this.photoControl.setValue(null);
			this.photoUrl.set(null);
		}
	}

	private getAddCustomLocationObservable(
		body: ModifyLocationDto
	): Observable<ApiResponse<any>> {
		if (this.editorToken) {
			return this.locationService.createSharedLocation(
				body,
				this.editorToken
			);
		} else {
			return this.locationService.createLocation(body);
		}
	}

	private getUploadImageObservable(): Observable<
		ApiResponse<UploadImageDto>
	> {
		if (this.editorToken) {
			return this.imageService.uploadShared(
				this.planId!,
				this.photoControl.value!,
				this.editorToken
			);
		} else {
			return this.imageService.upload(this.photoControl.value!);
		}
	}

	protected addCustomLocation(): void {
		this.submit();

		if (this.formGroup.valid) {
			var observable: Observable<ApiResponse<any>>;

			if (this.photoControl.value !== null) {
				observable = this.getUploadImageObservable().pipe(
					switchMap((x) => {
						const body: ModifyLocationDto = {
							id: null,
							planId: this.planId!,
							day: this.day!,
							category: this.categoryControl.value!.value,
							name: this.nameControl.value,
							address: this.addressControl.value,
							photoUrl: x.data.fileUrl,
							notes: this.notesControl.value,
							location: null,
							time: this.timeControl.value
								? this.datePipe.transform(
										this.timeControl.value,
										"HH:mm"
								  )
								: null,
							currencyName: this.currencyName!,
							cost: this.costControl.value,
							sortOrder: this.lastSortOrder! + 1,
						};

						return this.getAddCustomLocationObservable(body);
					})
				);
			} else {
				const body: ModifyLocationDto = {
					id: null,
					planId: this.planId!,
					day: this.day!,
					category: this.categoryControl.value!.value,
					name: this.nameControl.value,
					address: this.addressControl.value,
					photoUrl: null,
					notes: this.notesControl.value,
					location: null,
					time: this.timeControl.value
						? this.datePipe.transform(
								this.timeControl.value,
								"HH:mm"
						  )
						: null,
					currencyName: this.currencyName!,
					cost: this.costControl.value,
					sortOrder: this.lastSortOrder! + 1,
				};

				observable = this.getAddCustomLocationObservable(body);
			}

			observable.subscribe({
				next: () => {
					this.snackbarService.openSnackBar(
						"Location added succesfully.",
						ESnackbarType.INFO
					);
					this.ref.close(true);
				},
			});
		}
	}
}
