import { Component, DestroyRef, Inject, signal } from "@angular/core";
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
import { SearchLocationDto } from "../../models/search-location-dto";
import { DefaultImageComponent } from "../../../../shared/components/images/default-image/default-image.component";
import { TitleCasePipe } from "@angular/common";
import { catchError, EMPTY, Observable, switchMap } from "rxjs";
import { ModifyLocationDto } from "../../models/modify-location-dto";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { ApiResponse } from "../../../../core/models/api/api-response";

@Component({
	selector: "app-add-location-popup",
	imports: [
		BasePopupComponent,
		MatDialogContent,
		TextInputComponent,
		ReactiveFormsModule,
		ButtonComponent,
		BorderButtonComponent,
		DefaultImageComponent,
		TitleCasePipe,
	],
	templateUrl: "./add-location-popup.component.html",
	styleUrl: "./add-location-popup.component.css",
})
export class AddLocationPopupComponent {
	protected planId: string | null = null;
	private destination: string | null = null;
	protected locationList = signal<Array<SearchLocationDto>>(new Array());
	private day: number | null = null;
	private lastSortOrder: number | null = null;
	private currencyName: string | null = null;
	private editorToken: string | null = null;
	protected nameFilter = new FormControl<string>("");

	constructor(
		private ref: MatDialogRef<AddLocationPopupComponent>,
		@Inject(MAT_DIALOG_DATA)
		private data: {
			planId: string;
			destination: string;
			day: number;
			lastSortOrder: number;
			currencyName: string;
			editorToken: string | null;
		},
		private dialog: MatDialog,
		private snackbarService: SnackbarService,
		private locationService: LocationService,
		private destroyRef: DestroyRef,
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

		if (data.lastSortOrder === undefined) {
			snackbarService.openSnackBar(
				"Can't get last sort order!",
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

		if (data.editorToken === undefined) {
			snackbarService.openSnackBar(
				"Can't get Editor token!",
				ESnackbarType.ERROR
			);
			ref.close();
			return;
		}

		this.planId = data.planId;
		this.destination = data.destination;
		this.day = data.day;
		this.lastSortOrder = data.lastSortOrder;
		this.currencyName = data.currencyName;
		this.editorToken = data.editorToken;
	}

	protected navigateToLocationRecommendationsPage(): void {
		this.ref.close();

		if (this.editorToken) {
			this.router.navigateByUrl(
				`/location-recommendation/${this.planId}/${this.day}?share=${this.editorToken}`
			);
		} else {
			this.router.navigateByUrl(
				`/location-recommendation/${this.planId}/${this.day}`
			);
		}
	}

	protected openAddCustomLocationPopup(): void {
		const dialogRef = this.dialog.open(AddCustomLocationPopupComponent, {
			minWidth: "35%",
			maxWidth: "50vw",
			maxHeight: "80%",
			data: {
				planId: this.planId,
				currencyName: this.currencyName,
				day: this.day,
				lastSortOrder: this.lastSortOrder,
				editorToken: this.editorToken,
			},
		});
		dialogRef
			.afterClosed()
			.pipe(takeUntilDestroyed(this.destroyRef))
			.subscribe((x) => {
				if (x) {
					this.ref.close(true);
				}
			});
	}

	protected onAdd(location: SearchLocationDto): void {
		const body: ModifyLocationDto = {
			id: null,
			planId: this.planId!,
			day: this.day!,
			category: location.category.name,
			name: location.name,
			address: location.address.address_string,
			photoUrl: location.photoUrl,
			notes: location.notes
				? location.notes.length > 495
					? location.notes
							.slice(
								0,
								location.notes.slice(0, 495).lastIndexOf(" ")
							)
							.concat("...")
					: location.notes
				: "",
			location: location.location,
			time: null,
			currencyName: this.currencyName!,
			cost: null,
			sortOrder: this.lastSortOrder! + 1,
		};

		var observable: Observable<ApiResponse<any>>;

		if (this.editorToken) {
			observable = this.locationService.createSharedLocation(
				body,
				this.editorToken
			);
		} else {
			observable = this.locationService.createLocation(body);
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

	protected onCheckReviews(location: SearchLocationDto): void {
		if (!location.webUrl || location.webUrl.length === 0) {
			this.snackbarService.openSnackBar(
				"No reviews available.",
				ESnackbarType.INFO
			);
			return;
		}

		window.open(location.webUrl, "_blank");
	}

	protected search(): void {
		var searchQuery: string = this.nameFilter.value ?? "";

		if (this.destination) {
			searchQuery = searchQuery.concat(" ", this.destination);
		}

		const query: SearchLocationQuery = {
			searchQuery: searchQuery,
		};

		this.locationService.searchLocation(query).subscribe((x) => {
			this.locationList.set(x.data);
		});
	}
}
