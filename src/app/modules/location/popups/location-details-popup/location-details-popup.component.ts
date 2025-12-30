import { ChangeDetectionStrategy, Component, Inject } from "@angular/core";
import { BasePopupComponent } from "../../../base-popup/base-popup.component";
import {
	MAT_DIALOG_DATA,
	MatDialogActions,
	MatDialogContent,
	MatDialogRef,
} from "@angular/material/dialog";
import { BaseFormComponent } from "../../../base-form-page/base-form-page.component";
import { FormBuilder, ReactiveFormsModule } from "@angular/forms";
import { Location } from "../../../../core/models/domain/location/location";
import { SnackbarService } from "../../../../core/services/snackbar/snackbar.service";
import { ESnackbarType } from "../../../../core/models/utils/others/snackbar-type.enum";
import { CommonModule, DatePipe, DecimalPipe } from "@angular/common";
import { GetLocationDto } from "../../models/get-location-dto";

@Component({
	selector: "app-location-details-popup",
	imports: [
		BasePopupComponent,
		MatDialogContent,
		DatePipe,
		DecimalPipe,
		CommonModule,
	],
	templateUrl: "./location-details-popup.component.html",
	styleUrl: "./location-details-popup.component.css",
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LocationDetailsPopupComponent {
	protected location: GetLocationDto | null = null;

	constructor(
		private ref: MatDialogRef<LocationDetailsPopupComponent>,
		@Inject(MAT_DIALOG_DATA)
		private data: {
			location: GetLocationDto;
		},
		private snackbarService: SnackbarService
	) {
		if (!data.location) {
			snackbarService.openSnackBar(
				"Can't get Location Details!",
				ESnackbarType.ERROR
			);
			ref.close();
			return;
		}

		this.location = data.location;
	}
}
