import { Component, Inject, signal } from "@angular/core";
import { BasePopupComponent } from "../../../base-popup/base-popup.component";
import {
	MAT_DIALOG_DATA,
	MatDialogActions,
	MatDialogContent,
	MatDialogRef,
} from "@angular/material/dialog";
import { LocationCategory } from "../../../../shared/enums/location-category";
import { IValueOption } from "../../../../shared/models/utils/value-option";
import { GeneralUtils } from "../../../../shared/utils/general-utils";
import { DropdownComponent } from "../../../../shared/components/dropdowns/dropdown/dropdown.component";
import { Location } from "../../../../core/models/domain/location/location";
import { SnackbarService } from "../../../../core/services/snackbar/snackbar.service";
import { ESnackbarType } from "../../../../core/models/utils/others/snackbar-type.enum";
import { ButtonComponent } from "../../../../shared/components/buttons/button/button.component";
import { LocationService } from "../../services/location.service";
import { GetLocationByPlanDto } from "../../models/get-location-by-plan-dto";
import { GetLocationDto } from "../../models/get-location-dto";

@Component({
	selector: "app-filter-location-recommendations-popup",
	imports: [
		BasePopupComponent,
		MatDialogContent,
		MatDialogActions,
		DropdownComponent,
		ButtonComponent,
	],
	templateUrl: "./filter-location-recommendations-popup.component.html",
	styleUrl: "./filter-location-recommendations-popup.component.css",
})
export class FilterLocationRecommendationsPopupComponent {
	protected locationCategoryOptionList = signal<Array<IValueOption>>(
		new Array()
	);
	protected locationList = signal<Array<IValueOption>>(new Array());
	protected selectedLocationCategory = signal<IValueOption | null>(null);
	protected selectedLocation = signal<IValueOption | null>(null);

	constructor(
		private ref: MatDialogRef<FilterLocationRecommendationsPopupComponent>,
		@Inject(MAT_DIALOG_DATA)
		private data: {
			locationCategories: Array<IValueOption>;
			locationList: Array<GetLocationDto>;
		},
		private snackbarService: SnackbarService,
		private locationService: LocationService
	) {
		if (!data || !data.locationCategories || !data.locationList) {
			snackbarService.openSnackBar(
				"Can't get data!",
				ESnackbarType.ERROR
			);
			ref.close();
			return;
		}

		this.locationCategoryOptionList.set(data.locationCategories);

		this.locationList.set(
			data.locationList
				.filter(
					(x) =>
						x.location &&
						x.location.latitude &&
						x.location.longitude
				)
				.map((x) => {
					return {
						id: x.id,
						value: x.name,
					};
				})
		);
	}

	protected onLocationCategorySelected(
		locationCategory: IValueOption | null
	): void {
		this.selectedLocationCategory.set(locationCategory);
	}

	protected onLocationSelected(location: IValueOption | null): void {
		this.selectedLocation.set(location);
	}

	protected onFilter(): void {
		if (
			this.selectedLocation() === null &&
			this.selectedLocationCategory() === null
		) {
			return;
		}

		this.ref.close({
			selectedLocationCategory: this.selectedLocationCategory(),
			selectedLocation: this.selectedLocation(),
		});
	}
}
