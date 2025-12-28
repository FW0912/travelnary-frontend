import {
	ChangeDetectionStrategy,
	Component,
	DestroyRef,
	effect,
	signal,
} from "@angular/core";
import { BorderButtonComponent } from "../../../../shared/components/buttons/border-button/border-button.component";
import { LocationsComponent } from "../../../location/components/locations/locations.component";
import { CommentsComponent } from "../../../comment/components/comments/comments.component";
import { CommonModule } from "@angular/common";
import { SharePlanPopupComponent } from "../../popups/share-plan-popup/share-plan-popup.component";
import { Comment } from "../../../../core/models/domain/comment/comment";
import { Location } from "../../../../core/models/domain/location/location";
import { Plan } from "../../../../core/models/domain/plan/plan";
import { ActivatedRoute, Router } from "@angular/router";
import { SnackbarService } from "../../../../core/services/snackbar/snackbar.service";
import { MatDialog } from "@angular/material/dialog";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { ESnackbarType } from "../../../../core/models/utils/others/snackbar-type.enum";
import { ConfirmationPopupComponent } from "../../../confirmation-popup/confirmation-popup.component";
import { EditPlanPopupComponent } from "../../popups/edit-plan-popup/edit-plan-popup.component";
import { AuthService } from "../../../../core/services/auth/auth.service";
import { PlanService } from "../../services/plan.service";
import { GetPlanByIdDto } from "../../models/get-plan-by-id-dto";
import { LocationService } from "../../../location/services/location.service";
import { GetLocationByPlanDto } from "../../../location/models/get-location-by-plan-dto";
import { GetLocationByIdDto } from "../../../location/models/get-location-by-id-dto";
import { GetLocationDto } from "../../../location/models/get-location-dto";
import { catchError, EMPTY, iif, map, Observable, of, switchMap } from "rxjs";
import { PlanDetailsComponent } from "./components/plan-details/plan-details.component";
import { UpdateLocationSortOrderDto } from "../../../location/models/update-location-sort-order-dto";
import { GetCommentDto } from "../../../comment/models/get-comment-dto";
import { CommentService } from "../../../comment/services/comment.service";
import { GetCommentByPlanDto } from "../../../comment/models/get-comment-by-plan-dto";
import { ApiResponse } from "../../../../core/models/api/api-response";

@Component({
	selector: "app-plan-page",
	imports: [
		PlanDetailsComponent,
		BorderButtonComponent,
		LocationsComponent,
		CommentsComponent,
		CommonModule,
	],
	changeDetection: ChangeDetectionStrategy.OnPush,
	templateUrl: "./plan-page.component.html",
	styleUrl: "./plan-page.component.css",
})
export class PlanPageComponent {
	private planId = signal<string>("");
	protected shareToken = signal<string | null>(null);
	protected plan = signal<GetPlanByIdDto | null>(null);
	protected estimatedCost = signal<number>(0);
	protected locationList = signal<Array<GetLocationByPlanDto>>(new Array());
	protected comments = signal<GetCommentByPlanDto | null>(null);

	constructor(
		private route: ActivatedRoute,
		private destroyRef: DestroyRef,
		private router: Router,
		private snackbarService: SnackbarService,
		private dialog: MatDialog,
		private planService: PlanService,
		private locationService: LocationService,
		private commentService: CommentService,
		protected authService: AuthService
	) {
		route.paramMap.pipe(takeUntilDestroyed()).subscribe((x) => {
			if (x.get("id") === null || x.get("id")!.length === 0) {
				snackbarService.openSnackBar(
					"Plan not found!",
					ESnackbarType.INFO,
					2000
				);
				router.navigateByUrl("/home");
			} else {
				this.planId.set(x.get("id")!);
			}
		});

		route.queryParamMap.pipe(takeUntilDestroyed()).subscribe((x) => {
			this.shareToken.set(x.get("share"));
		});
	}

	ngOnInit(): void {
		this.fetchData();
	}

	private getPlanObservable(): Observable<ApiResponse<GetPlanByIdDto>> {
		if (this.shareToken() !== null) {
			return this.planService
				.getPlanByToken(this.planId(), this.shareToken()!)
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
			return this.planService.getPlanById(this.planId());
		}
	}

	private fetchData(): void {
		var observable: Observable<ApiResponse<GetPlanByIdDto>> =
			this.getPlanObservable();

		observable
			.pipe(
				switchMap((x) => {
					this.plan.set(x.data);

					return this.locationService.getLocationByPlan(
						this.planId()
					);
				}),
				switchMap((x) => {
					const map: Map<number, GetLocationByPlanDto> = new Map();
					var totalEstimatedCost: number = 0;

					x.data.forEach((y) => {
						map.set(y.day, y);

						y.locations.forEach((z) => {
							if (z.cost) {
								totalEstimatedCost += z.cost;
							}
						});
					});

					this.estimatedCost.set(totalEstimatedCost);

					const amountOfDays: number =
						Math.ceil(
							Math.abs(
								new Date(this.plan()!.dateStart).getTime() -
									new Date(this.plan()!.dateEnd).getTime()
							) /
								(1000 * 3600 * 24)
						) + 1;
					const locationList: Array<GetLocationByPlanDto> =
						new Array();

					for (let i = 1; i <= amountOfDays; i++) {
						if (map.has(i)) {
							locationList.push(map.get(i)!);
						} else {
							locationList.push({
								day: i,
								locations: new Array(),
							});
						}
					}

					this.locationList.set(locationList);

					return this.commentService.getCommentByPlan(this.planId());
				})
			)
			.subscribe({
				next: (x) => {
					this.comments.set(x.data);
				},
			});
	}

	protected openEditPlanPopup(): void {
		const ref = this.dialog.open(EditPlanPopupComponent, {
			minWidth: "35%",
			maxWidth: "50vw",
			maxHeight: "80%",
			data: {
				plan: this.plan(),
				editorToken: this.shareToken(),
			},
		});

		ref.afterClosed()
			.pipe(takeUntilDestroyed(this.destroyRef))
			.subscribe((x) => {
				if (x) {
					this.fetchData();
				}
			});
	}

	protected togglePin(): void {
		this.planService.pinPlan(this.planId()).subscribe({
			next: (x) => {
				this.plan.update((y) => ({
					...y!,
					isPinned: x.data.isPinned,
				}));
			},
		});
	}

	protected toggleLike(): void {
		this.planService.likePlan(this.planId()).subscribe({
			next: (x) => {
				this.plan.update((y) => ({
					...y!,
					isLiked: x.data.isLiked,
					likeCount: x.data.isLiked ? ++y!.likeCount : --y!.likeCount,
				}));
			},
		});
	}

	protected openSharePlanPopup(): void {
		this.dialog.open(SharePlanPopupComponent, {
			minWidth: "35%",
			maxHeight: "80%",
			data: {
				planId: this.planId(),
				isOwner: this.plan()!.isOwner,
			},
		});
	}

	protected openDeletePopup(): void {
		const ref = this.dialog.open(ConfirmationPopupComponent, {
			minWidth: "35%",
		});

		ref.afterClosed()
			.pipe(takeUntilDestroyed(this.destroyRef))
			.subscribe((x) => {
				if (x) {
					this.planService.deletePlan(this.planId()).subscribe({
						next: () => {
							this.snackbarService.openSnackBar(
								"Plan deleted successfully.",
								ESnackbarType.INFO
							);
							this.router.navigateByUrl("/your-plans");
						},
					});
				}
			});
	}

	protected onModifyLocation(): void {
		this.locationService.getLocationByPlan(this.planId()).subscribe({
			next: (x) => {
				const map: Map<number, GetLocationByPlanDto> = new Map();
				var totalEstimatedCost: number = 0;

				x.data.forEach((y) => {
					map.set(y.day, y);

					y.locations.forEach((z) => {
						if (z.cost) {
							totalEstimatedCost += z.cost;
						}
					});
				});

				this.estimatedCost.set(totalEstimatedCost);

				const amountOfDays: number =
					Math.ceil(
						Math.abs(
							new Date(this.plan()!.dateStart).getTime() -
								new Date(this.plan()!.dateEnd).getTime()
						) /
							(1000 * 3600 * 24)
					) + 1;
				const locationList: Array<GetLocationByPlanDto> = new Array();

				for (let i = 1; i <= amountOfDays; i++) {
					if (map.has(i)) {
						locationList.push(map.get(i)!);
					} else {
						locationList.push({
							day: i,
							locations: new Array(),
						});
					}
				}

				this.locationList.set(locationList);
			},
		});
	}

	private getUpdateLocationSortOrderObservable(
		body: UpdateLocationSortOrderDto
	): Observable<ApiResponse<boolean>> {
		if (this.shareToken() && this.plan()!.isEditor) {
			return this.locationService.updateSharedLocationSortOrder(
				body,
				this.shareToken()!
			);
		} else {
			return this.locationService.updateLocationSortOrder(body);
		}
	}

	protected onSortLocation(event: {
		day: number;
		locationList: Array<GetLocationDto>;
	}): void {
		const body: UpdateLocationSortOrderDto = {
			planId: this.planId(),
			day: event.day,
			items: event.locationList.map((x) => {
				return {
					id: x.id,
					sortOrder: x.sortOrder,
				};
			}),
		};

		var observable: Observable<ApiResponse<boolean>> =
			this.getUpdateLocationSortOrderObservable(body);

		observable.subscribe({
			next: (x) => {
				if (x) {
					this.locationList.update((x) =>
						x.map((y) => {
							if (y.day === event.day) {
								return {
									...y,
									locations: event.locationList,
								};
							}

							return y;
						})
					);

					this.snackbarService.openSnackBar(
						"Location orders changed successfully.",
						ESnackbarType.INFO
					);
				}
			},
		});
	}

	protected onDeleteLocation(event: { day: number; id: string }): void {
		this.locationList.update((x) =>
			x.map((y) => {
				if (y.day === event.day) {
					y.locations = y.locations.filter((z) => z.id !== event.id);
				}

				return y;
			})
		);
	}

	protected onPostComment(event: GetCommentDto): void {
		this.comments.update((x) => {
			if (x) {
				return { ...x, comments: [...x.comments, event] };
			}

			return x;
		});
	}

	protected onCommentReply(): void {
		this.commentService.getCommentByPlan(this.planId()).subscribe({
			next: (x) => {
				this.comments.set(x.data);
			},
		});
	}
}
