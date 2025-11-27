import { ChangeDetectionStrategy, Component, signal } from "@angular/core";
import { PlanDetailsComponent } from "../../plan-details/plan-details.component";
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

	protected plan = signal<GetPlanByIdDto | null>(null);

	protected locationList = signal<Array<GetLocationByPlanDto>>(new Array());

	protected numberOfDays = signal<number>(0);

	protected commentsList = signal<Array<Comment>>([
		{
			id: "b4fb9faf-5a6f-4626-ac14-34a4b231727c",
			plan_id: "03e06d97-7ef1-4d32-b7fa-2a709e440973",
			user: {
				username: "Cheryl",
				profile_url: "",
			},
			content:
				"This is a plan that I created for me and my friends. It focuses on sightseeing and pictures.",
			is_reply: false,
			reply_list: [
				{
					id: "8ae3b3ae-28fd-4605-b216-f6b2420a1a58",
					plan_id: "03e06d97-7ef1-4d32-b7fa-2a709e440973",
					user: {
						username: "Andre Valas",
						profile_url: "",
					},
					content:
						"Great plan, but I wish there were more locations.",
					is_reply: true,
					reply_list: [],
					posted_date: new Date("2025-09-18"),
					like_count: 2,
					is_owner: false,
					is_liked: false,
				},
			],
			posted_date: new Date("2025-09-12"),
			like_count: 7,
			is_owner: true,
			is_liked: false,
		},
		{
			id: "92d4e775-af45-4673-a4c0-02b2d241dea5",
			plan_id: "03e06d97-7ef1-4d32-b7fa-2a709e440973",
			user: {
				username: "Andre Valas",
				profile_url: "",
			},
			content:
				"Have you ever considered adding more restaurants? The food scene in the Bahamas is great.",
			is_reply: false,
			reply_list: [],
			posted_date: new Date("2025-09-18"),
			like_count: 5,
			is_owner: false,
			is_liked: true,
		},
	]);

	constructor(
		private route: ActivatedRoute,
		private router: Router,
		private snackbarService: SnackbarService,
		private dialog: MatDialog,
		private planService: PlanService,
		private locationService: LocationService,
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
	}

	ngOnInit(): void {
		this.planService.getPlanById(this.planId()).subscribe({
			next: (x) => {
				this.plan.set(x.data);
			},
		});

		this.locationService.getLocationByPlan(this.planId()).subscribe({
			next: (x) => {
				this.numberOfDays.set(
					x.data.reduce((x, y) => (x.day > y.day ? x : y)).day
				);
				this.locationList.set(x.data);
			},
		});
	}

	protected openEditPlanPopup(): void {
		this.dialog.open(EditPlanPopupComponent, {
			minWidth: "35%",
			maxHeight: "80%",
			data: {
				plan: this.plan(),
			},
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
				isOwner: this.plan()!.isOwner,
			},
		});
	}

	protected openDeletePopup(): void {
		const ref = this.dialog.open(ConfirmationPopupComponent, {
			minWidth: "35%",
		});

		ref.afterClosed().subscribe((x) => {
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

	protected onLocationSort(event: {
		day: number;
		locationList: Array<GetLocationDto>;
	}): void {
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
}
