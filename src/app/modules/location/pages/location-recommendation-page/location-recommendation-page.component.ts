import {
	ChangeDetectionStrategy,
	Component,
	DestroyRef,
	signal,
} from "@angular/core";
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
import { SearchLocationDto } from "../../models/search-location-dto";
import { TitleCasePipe } from "@angular/common";
import { DefaultImageComponent } from "../../../../shared/components/images/default-image/default-image.component";
import { Observable } from "rxjs";
import { ApiResponse } from "../../../../core/models/api/api-response";
import { SearchLocationQuery } from "../../models/search-location-query";

@Component({
	selector: "app-location-recommendation-page",
	imports: [
		LocationsComponent,
		BorderButtonComponent,
		LocationDetailsSectionComponent,
		ButtonComponent,
		TitleCasePipe,
		DefaultImageComponent,
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
	protected recommendedLocationList = signal<Array<SearchLocationDto>>(
		new Array()
	);
	private locationCategoryOptionList: Array<IValueOption> | null = null;
	protected locationCategoryFilter = signal<IValueOption | null>(null);
	protected locationFilter = signal<IValueOption | null>(null);

	constructor(
		private route: ActivatedRoute,
		private router: Router,
		private snackbarService: SnackbarService,
		private planService: PlanService,
		private locationService: LocationService,
		private dialog: MatDialog,
		private destroyRef: DestroyRef
	) {
		route.paramMap.pipe(takeUntilDestroyed(destroyRef)).subscribe((x) => {
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
				if (x.data && x.data.length > 0) {
					this.locationList.set(
						x.data.find((x) => x.day === this.day)!.locations
					);
				}
			},
		});

		this.locationService.getAllLocationCategories().subscribe({
			next: (x) => {
				this.locationCategoryOptionList = x.data
					.filter((y) => y.name !== "Location")
					.map((y) => {
						return {
							id: y.id,
							value: y.name,
						};
					});
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
					locationCategories: this.locationCategoryOptionList,
					locationList: this.locationList(),
				},
			}
		);

		ref.afterClosed()
			.pipe(takeUntilDestroyed(this.destroyRef))
			.subscribe((x) => {
				if (!x) {
					return;
				}

				if (x.selectedLocationCategory !== null) {
					if (this.locationCategoryFilter() !== null) {
						this.snackbarService.openSnackBar(
							"1 category maximum for filter!",
							ESnackbarType.ERROR,
							2000
						);
						return;
					}

					this.locationCategoryFilter.set(x.selectedLocationCategory);
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

				this.search();
			});
	}

	protected removeLocationCategoryFilter(): void {
		this.locationCategoryFilter.set(null);
		this.search();
	}

	protected removeLocationFilter(): void {
		this.locationFilter.set(null);
		this.search();
	}

	private search(): void {
		if (
			this.locationCategoryFilter() === null &&
			this.locationFilter() === null
		) {
			this.snackbarService.openSnackBar(
				"No filters applied.",
				ESnackbarType.INFO,
				2000
			);
			this.recommendedLocationList.set(new Array());
			return;
		}

		var observable: Observable<ApiResponse<Array<SearchLocationDto>>>;

		if (this.locationFilter() !== null) {
			const location: GetLocationDto = this.locationList().find(
				(x) => x.id === this.locationFilter()!.id
			)!;

			var body: SearchLocationQuery = {
				LatLong:
					location.location.latitude +
					"," +
					location.location.longitude,
			};

			if (this.locationCategoryFilter() !== null) {
				body.Category = this.locationCategoryFilter()!.value;
			}

			observable = this.locationService.searchNearbyLocation(body);
		} else {
			const body: SearchLocationQuery = {
				searchQuery: this.destination!,
				Category: this.locationCategoryFilter()!.value,
			};

			observable = this.locationService.searchLocation(body);
		}

		observable.subscribe({
			next: (x) => {
				this.recommendedLocationList.set(x.data);
			},
		});
	}

	protected onAdd(): void {}

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
}
