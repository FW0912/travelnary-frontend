import {
	ChangeDetectionStrategy,
	Component,
	Inject,
	signal,
} from "@angular/core";
import { BasePopupComponent } from "../../../base-popup/base-popup.component";
import {
	MAT_DIALOG_DATA,
	MatDialogActions,
	MatDialogContent,
	MatDialogModule,
	MatDialogRef,
} from "@angular/material/dialog";
import { Location } from "../../../../core/models/domain/location/location";
import { SnackbarService } from "../../../../core/services/snackbar/snackbar.service";
import { ESnackbarType } from "../../../../core/models/utils/others/snackbar-type.enum";
import { BaseFormComponent } from "../../../base-form-page/base-form-page.component";
import {
	FormBuilder,
	FormControl,
	ReactiveFormsModule,
	Validators,
} from "@angular/forms";
import { IValueOption } from "../../../../shared/models/utils/value-option";
import { DropdownComponent } from "../../../../shared/components/dropdowns/dropdown/dropdown.component";
import { GeneralUtils } from "../../../../shared/utils/general-utils";
import { LocationCategory } from "../../../../shared/enums/location-category";
import { CommonModule, DatePipe, DecimalPipe } from "@angular/common";
import { TextInputComponent } from "../../../../shared/components/inputs/text-input/text-input.component";
import { TextAreaComponent } from "../../../../shared/components/inputs/text-area/text-area.component";
import { TimePickerComponent } from "../../../../shared/components/inputs/time-picker/time-picker.component";
import { ButtonComponent } from "../../../../shared/components/buttons/button/button.component";

@Component({
	selector: "app-edit-location-popup",
	imports: [
		BasePopupComponent,
		MatDialogContent,
		MatDialogActions,
		ReactiveFormsModule,
		DropdownComponent,
		CommonModule,
		TextInputComponent,
		TextAreaComponent,
		TimePickerComponent,
		ButtonComponent,
	],
	templateUrl: "./edit-location-popup.component.html",
	styleUrl: "./edit-location-popup.component.css",
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditLocationPopupComponent extends BaseFormComponent {
	protected readonly LOCATION_CATEGORY_OPTION_LIST: Array<IValueOption> =
		GeneralUtils.getOptionList(LocationCategory);
	protected location: Location | null = null;

	constructor(
		private ref: MatDialogRef<EditLocationPopupComponent>,
		@Inject(MAT_DIALOG_DATA)
		private data: {
			location: Location;
		},
		private snackbarService: SnackbarService,
		private fb: FormBuilder
	) {
		super();

		if (!data || !data.location) {
			snackbarService.openSnackBar(
				"Can't get Location Details!",
				ESnackbarType.ERROR
			);
			ref.close();
			return;
		}

		this.location = data.location;

		this.setFormGroup(
			fb.group({
				category: fb.control<IValueOption | null>(
					{
						id: this.location.category.id,
						value: this.location.category.name,
					},
					[Validators.required]
				),
				name: fb.control<string>(this.location.name, [
					Validators.required,
					Validators.minLength(5),
				]),
				address: fb.control<string>(this.location.address, [
					Validators.required,
				]),
				notes: fb.control<string>(this.location.notes),
				time: fb.control<Date | null>(this.location.time, [
					Validators.required,
				]),
				cost: fb.control<number>(this.location.cost),
			})
		);
	}

	protected get categoryControl(): FormControl {
		return this.formGroup.get("category")! as FormControl;
	}

	protected onCategorySelected(category: IValueOption | null) {
		this.formGroup.get("category")!.setValue(category);
	}

	protected editLocation(): void {
		this.submit();
		console.log(this.formGroup);
	}
}
