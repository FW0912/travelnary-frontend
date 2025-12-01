import { Component, Inject, signal } from "@angular/core";
import {
	MAT_DIALOG_DATA,
	MatDialog,
	MatDialogContent,
	MatDialogRef,
} from "@angular/material/dialog";
import { BasePopupComponent } from "../../../base-popup/base-popup.component";
import { TextInputComponent } from "../../../../shared/components/inputs/text-input/text-input.component";
import { FormControl, ReactiveFormsModule } from "@angular/forms";
import { Location } from "../../../../core/models/domain/location/location";
import { ButtonComponent } from "../../../../shared/components/buttons/button/button.component";
import { BorderButtonComponent } from "../../../../shared/components/buttons/border-button/border-button.component";
import { SnackbarService } from "../../../../core/services/snackbar/snackbar.service";
import { ESnackbarType } from "../../../../core/models/utils/others/snackbar-type.enum";
import { Router } from "@angular/router";
import { AddCustomLocationPopupComponent } from "../add-custom-location-popup/add-custom-location-popup.component";
import { LocationService } from "../../services/location.service";
import { SearchLocationQuery } from "../../models/search-location-query";

@Component({
	selector: "app-add-location-popup",
	imports: [
		BasePopupComponent,
		MatDialogContent,
		TextInputComponent,
		ReactiveFormsModule,
		ButtonComponent,
		BorderButtonComponent,
	],
	templateUrl: "./add-location-popup.component.html",
	styleUrl: "./add-location-popup.component.css",
})
export class AddLocationPopupComponent {
	protected planId: string | null = null;
	private destination: string | null = null;
	protected locationList = signal<Array<Location>>(new Array());
	private day: number | null = null;
	private currencyName: string | null = null;
	protected nameFilter = new FormControl<string>("");

	constructor(
		private ref: MatDialogRef<AddLocationPopupComponent>,
		@Inject(MAT_DIALOG_DATA)
		private data: {
			planId: string;
			destination: string;
			day: number;
			currencyName: string;
		},
		private dialog: MatDialog,
		private snackbarService: SnackbarService,
		private locationService: LocationService,
		private router: Router
	) {
		if (!data) {
			snackbarService.openSnackBar(
				"Can't get data!",
				ESnackbarType.ERROR
			);
			ref.close();
			return;
		}

		if (!data.planId || !data.destination) {
			snackbarService.openSnackBar(
				"Can't get Plan!",
				ESnackbarType.ERROR
			);
			ref.close();
			return;
		}

		if (!data.day) {
			snackbarService.openSnackBar(
				"Can't get current day!",
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

		this.planId = data.planId;
		this.destination = data.destination;
		this.day = data.day;
		this.currencyName = data.currencyName;
	}

	protected navigateToLocationRecommendationsPage(): void {
		this.ref.close();
		this.router.navigateByUrl(
			`/location-recommendation/${this.planId}/${this.day}`
		);
	}

	protected openAddCustomLocationPopup(): void {
		this.dialog.open(AddCustomLocationPopupComponent, {
			minWidth: "35%",
			maxHeight: "80%",
			data: {
				currencyName: this.currencyName,
			},
		});
		this.ref.close();
	}

	protected onAdd(): void {
		this.ref.close();
	}

	protected onCheckDetails(): void {
		this.ref.close();
	}

	protected search(): void {
		var searchQuery: string = this.nameFilter.value ?? "";

		if (this.destination) {
			searchQuery.concat(" ", this.destination);
		}

		const query: SearchLocationQuery = {
			searchQuery: searchQuery,
		};

		this.locationService.searchLocation(query);
	}
}
