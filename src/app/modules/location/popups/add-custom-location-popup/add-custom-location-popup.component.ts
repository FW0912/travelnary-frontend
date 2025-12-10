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
	],
	templateUrl: "./add-custom-location-popup.component.html",
	styleUrl: "./add-custom-location-popup.component.css",
})
export class AddCustomLocationPopupComponent extends BaseFormComponent {
	private planId: string | null = null;
	protected currencyName: string | null = null;
	private day: number | null = null;
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
		},
		private snackbarService: SnackbarService,
		private imageService: ImageService,
		private locationService: LocationService,
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

		this.planId = data.planId;
		this.currencyName = data.currencyName;
		this.day = data.day;

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

	protected addCustomLocation(): void {
		this.submit();

		if (this.formGroup.valid) {
			if (this.photoControl.value !== null) {
			} else {
				// const body: ModifyLocationDto = {
				// 	id: "",
				// 	planId: this.planId!,
				// 	day: this.day!,
				// 	category: {
				// 		id: this.categoryControl.value!.id,
				// 		name: this.categoryControl.value!.value,
				// 		iconUrl: "",
				// 	},
				// 	name: this.nameControl.value,
				// 	address: this.addressControl.value,
				// 	photoUrl: null,
				// 	notes: this.notesControl.value,
				// 	location: {
				// 		latitude: null,
				// 		longitude: null,
				// 	},
				// 	time: this.timeControl.value?.toISOString() ?? null,
				// 	currencyName: this.currencyName!,
				// 	cost: this.costControl.value,
				// };
				// this.locationService.createLocation(body);
			}
		}
	}
}
