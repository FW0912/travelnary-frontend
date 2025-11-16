import { Component, Inject } from "@angular/core";
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
	protected readonly LOCATION_CATEGORY_OPTION_LIST: Array<IValueOption> =
		GeneralUtils.getOptionList(LocationCategory);
	protected currencyName: string | null = null;

	constructor(
		private ref: MatDialogRef<AddCustomLocationPopupComponent>,
		@Inject(MAT_DIALOG_DATA)
		private data: {
			currencyName: string;
		},
		private snackbarService: SnackbarService,
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

		if (!data.currencyName) {
			snackbarService.openSnackBar(
				"Can't get Currency Name!",
				ESnackbarType.ERROR
			);
			ref.close();
			return;
		}

		this.currencyName = data.currencyName;

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
				notes: fb.control<string>(""),
				time: fb.control<Date | null>(null, [Validators.required]),
				cost: fb.control<number | null>(null),
			})
		);
	}

	protected get categoryControl(): FormControl {
		return this.formGroup.get("category")! as FormControl;
	}

	protected onCategorySelected(category: IValueOption | null) {
		this.formGroup.get("category")!.setValue(category);
	}

	protected addCustomLocation(): void {
		this.submit();
	}
}
