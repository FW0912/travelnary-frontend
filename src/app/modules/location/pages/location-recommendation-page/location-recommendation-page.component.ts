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
import { catchError, EMPTY, map, Observable } from "rxjs";
import { ApiResponse } from "../../../../core/models/api/api-response";
import { SearchLocationQuery } from "../../models/search-location-query";
import { ModifyLocationDto } from "../../models/modify-location-dto";
import { GetPlanByIdDto } from "../../../plans/models/get-plan-by-id-dto";
import { AuthService } from "../../../../core/services/auth/auth.service";

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
	private currencyName: string | null = null;
	private lastSortOrder: number | null = null;
	private editorToken = signal<string | null>(null);
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
		private authService: AuthService,
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

		route.queryParamMap.pipe(takeUntilDestroyed()).subscribe((x) => {
			this.editorToken.set(x.get("share"));
		});
	}

	private getPlanObservable(): Observable<ApiResponse<GetPlanByIdDto>> {
		if (this.editorToken() !== null) {
			return this.planService
				.getPlanByToken(this.planId!, this.editorToken()!)
				.pipe(
					catchError(() => {
						this.snackbarService.openSnackBar(
							"Link is invalid, please request another link from the plan owner!",
							ESnackbarType.INFO,
							2000
						);
						this.router.navigateByUrl("/home");
						return EMPTY;
					}),
					map((x) => {
						if (
							this.authService.isLoggedIn() &&
							x.data.owner.id ===
								this.authService.getRequiredUserData().userId
						) {
							x.data.isOwner = true;
						}

						return x;
					})
				);
		} else {
			return this.planService.getPlanById(this.planId!);
		}
	}

	ngOnInit(): void {
		this.getPlanObservable().subscribe({
			next: (x) => {
				this.destination = x.data.destination;
			},
		});

		this.fetchLocations();

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

	private fetchLocations(): void {
		this.locationService.getLocationByPlan(this.planId!).subscribe({
			next: (x) => {
				if (x.data && x.data.length > 0) {
					this.locationList.set(
						x.data.find((x) => x.day === this.day)!.locations
					);

					this.locationList().forEach((x) => {
						if (
							this.lastSortOrder === null ||
							x.sortOrder > this.lastSortOrder
						) {
							this.lastSortOrder = x.sortOrder;
						}
					});
				}

				if (this.lastSortOrder === null) {
					this.lastSortOrder = 0;
				}
			},
		});
	}

	protected navigateBack(): void {
		if (this.editorToken()) {
			this.router.navigateByUrl(
				`/view-plan/${this.planId}?share=${this.editorToken()}`
			);
		} else {
			this.router.navigateByUrl(`/view-plan/${this.planId}`);
		}
	}

	protected openFilterRecommendationsPopup(): void {
		const ref = this.dialog.open(
			FilterLocationRecommendationsPopupComponent,
			{
				width: "35%",
				height: "50%",
				data: {
					locationCategories: this.locationCategoryOptionList,
					locationList: this.locationList().filter(
						(x) =>
							x.location &&
							x.location.latitude &&
							x.location.longitude
					),
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
				Category:
					this.locationCategoryFilter()?.value ??
					this.locationCategoryOptionList!.at(0)!.value,
				Radius: 10,
				RadiusUnit: "km",
			};

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

		if (this.editorToken()) {
			observable = this.locationService.createSharedLocation(
				body,
				this.editorToken()!
			);
		} else {
			observable = this.locationService.createLocation(body);
		}

		observable.subscribe({
			next: () => {
				this.recommendedLocationList.update((x) =>
					x.filter((y) => y.name !== location.name)
				);
				this.snackbarService.openSnackBar(
					"Location added succesfully.",
					ESnackbarType.INFO
				);
				this.fetchLocations();
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
}
