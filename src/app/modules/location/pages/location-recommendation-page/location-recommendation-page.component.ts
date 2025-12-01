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
import { GetLocationDto } from "../../models/get-location-dto";
import { PlanService } from "../../../plans/services/plan.service";
import { LocationService } from "../../services/location.service";

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
	protected destination: string | null = null;
	protected day: number | null = null;
	protected locationList = signal<Array<GetLocationDto>>(new Array());
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
		private planService: PlanService,
		private locationService: LocationService,
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

	ngOnInit(): void {
		this.planService.getPlanById(this.planId!).subscribe({
			next: (x) => {
				this.destination = x.data.destination;
			},
		});

		this.locationService.getLocationByPlan(this.planId!).subscribe({
			next: (x) => {
				this.locationList.set(
					x.data.find((x) => x.day === this.day)!.locations
				);
			},
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
