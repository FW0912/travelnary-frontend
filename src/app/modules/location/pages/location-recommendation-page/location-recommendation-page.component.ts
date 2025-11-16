import { ChangeDetectionStrategy, Component, signal } from "@angular/core";
import { Location } from "../../../../core/models/domain/location/location";
import { ActivatedRoute, Router } from "@angular/router";
import { SnackbarService } from "../../../../core/services/snackbar/snackbar.service";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { ESnackbarType } from "../../../../core/models/utils/others/snackbar-type.enum";
import { LocationsComponent } from "../../components/locations/locations.component";
import { BorderButtonComponent } from "../../../../shared/components/buttons/border-button/border-button.component";
import { LocationDetailsSectionComponent } from "../../components/locations/components/location-details-section/location-details-section.component";
import { ButtonComponent } from "../../../../shared/components/buttons/button/button.component";
import { MatDialog } from "@angular/material/dialog";
import { FilterLocationRecommendationsPopupComponent } from "../../popups/filter-location-recommendations-popup/filter-location-recommendations-popup.component";
import { IValueOption } from "../../../../shared/models/utils/value-option";

@Component({
	selector: "app-location-recommendation-page",
	imports: [
		LocationsComponent,
		BorderButtonComponent,
		LocationDetailsSectionComponent,
		ButtonComponent,
	],
	templateUrl: "./location-recommendation-page.component.html",
	styleUrl: "./location-recommendation-page.component.css",
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LocationRecommendationPageComponent {
	protected planId: string | null = null;
	protected day: number | null = null;
	protected locationList = signal<Array<Location>>([
		{
			id: "d27d8e22-631e-4a45-9eb1-8a0588a212c3",
			planId: "6b17e11f-133d-4dae-9720-44e96d8d105e",
			category: {
				id: "f28dff01-df6d-47e1-8b08-3a3e2171dc88",
				name: "Lodging",
			},
			order: 1,
			name: "Sunset Point Houseboat",
			address: "Fresh Creek, Andros Town, Bahamas",
			day: new Date("2025-05-21"),
			notes: "Booked under Jason's name",
			time: new Date("2025-05-21T09:30:00"),
			currencyName: "IDR",
			cost: 4300000,
		},
		{
			id: "826f8887-31b2-4976-9f4b-e15e65194ed3",
			planId: "c713a7a5-bae4-472e-bda4-fa8cf04768f3",
			category: {
				id: "555b9a5a-d337-4e1f-bebb-45e129027827",
				name: "Food",
			},
			order: 2,
			name: "Brigadier's Restaurant",
			address: "Hard Bargain, Bahamas",
			day: new Date("2025-05-21"),
			notes: "",
			time: new Date("2025-05-21T11:00:00"),
			currencyName: "IDR",
			cost: 600000,
		},
		{
			id: "45ae069e-5b5e-4b56-bc69-7c6aa6091949",
			planId: "92284eae-9b0a-4c9a-9bf2-2f4bd7bdcf5b",
			category: {
				id: "824defac-71ac-4253-b90e-f98787470402",
				name: "Entertainment",
			},
			order: 3,
			name: "Captain Bill's Blue Hole",
			address: "P4RQ+R6J, Hard Bargain, Bahamas",
			day: new Date("2025-05-21"),
			notes: "Do cycling and take a hike here, make sure to bring power banks and sunscreen, and take precautions if necessary. asdadasdasdasdasdsdaffadfhadfhadfdafhadfhdafhadfhafhdafh",
			time: new Date("2025-05-21T12:30:00"),
			currencyName: "IDR",
			cost: 1400000,
		},
	]);
	protected recommendedLocationList = signal<Array<Location>>([
		{
			id: "1",
			planId: "1",
			category: {
				id: "1",
				name: "Food",
			},
			order: 0,
			name: "The New Duff",
			address: "139 W Bay St, Nassau, Bahamas",
			day: new Date(),
			notes: "Restaurant",
			time: new Date(),
			currencyName: "",
			cost: 0,
		},
		{
			id: "2",
			planId: "1",
			category: {
				id: "2",
				name: "Lodging",
			},
			order: 0,
			name: "Warwick Paradise Island",
			address: "Harbour Dr, Nassau, Bahamas",
			day: new Date(),
			notes: "4-star hotel",
			time: new Date(),
			currencyName: "",
			cost: 0,
		},
	]);
	protected locationCategoryFilterList = signal<Array<IValueOption>>(
		new Array()
	);
	protected locationFilter = signal<IValueOption | null>(null);

	constructor(
		private route: ActivatedRoute,
		private router: Router,
		private snackbarService: SnackbarService,
		private dialog: MatDialog
	) {
		route.paramMap.pipe(takeUntilDestroyed()).subscribe((x) => {
			if (x.get("id") === null || x.get("id")!.length === 0) {
				snackbarService.openSnackBar(
					"Plan not found!",
					ESnackbarType.ERROR,
					2000
				);
				router.navigateByUrl("/home");
			} else {
				this.planId = x.get("id");
			}

			if (x.get("day") === null || x.get("day")!.length === 0) {
				snackbarService.openSnackBar(
					"Day not found!",
					ESnackbarType.INFO,
					2000
				);
				router.navigateByUrl("/home");
			} else {
				this.day = Number.parseInt(x.get("day")!);
			}
		});
	}

	protected navigateBack(): void {
		this.router.navigateByUrl(`/view-plan/${this.planId}`);
	}

	protected openFilterRecommendationsPopup(): void {
		const ref = this.dialog.open(
			FilterLocationRecommendationsPopupComponent,
			{
				width: "35%",
				height: "50%",
				data: {
					locationList: this.locationList(),
				},
			}
		);

		ref.afterClosed().subscribe((x) => {
			if (!x) {
				return;
			}

			if (x.selectedLocationCategory !== null) {
				if (
					this.locationCategoryFilterList().find(
						(y) => y.id === x.selectedLocationCategory.id
					)
				) {
					this.snackbarService.openSnackBar(
						"Category is already filtered!",
						ESnackbarType.ERROR,
						2000
					);
				} else {
					this.locationCategoryFilterList.update((y) => {
						y.push(x.selectedLocationCategory);
						return [...y];
					});
				}
			}

			if (x.selectedLocation !== null) {
				if (this.locationFilter() !== null) {
					this.snackbarService.openSnackBar(
						"1 location maximum for filter!",
						ESnackbarType.ERROR,
						2000
					);
					return;
				}
				this.locationFilter.set(x.selectedLocation);
			}
		});
	}

	protected removeLocationCategoryFilter(
		locationCategoryFilter: IValueOption
	): void {
		this.locationCategoryFilterList.update((x) =>
			x.filter((y) => y !== locationCategoryFilter)
		);
	}

	protected removeLocationFilter(): void {
		this.locationFilter.set(null);
	}

	protected onAdd(): void {}

	protected onCheckDetails(): void {}
}
