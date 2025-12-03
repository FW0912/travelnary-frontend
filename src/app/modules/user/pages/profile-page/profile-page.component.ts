import { ChangeDetectionStrategy, Component, signal } from "@angular/core";
import { UserImageComponent } from "../../../../shared/components/images/user-image/user-image.component";
import { UserProfile } from "../../../../core/models/domain/user/user-profile";
import { ActivatedRoute, Router } from "@angular/router";
import { AuthService } from "../../../../core/services/auth/auth.service";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { SnackbarService } from "../../../../core/services/snackbar/snackbar.service";
import { ESnackbarType } from "../../../../core/models/utils/others/snackbar-type.enum";
import { NavigationService } from "../../../../core/services/navigation/navigation.service";
import { DatePipe } from "@angular/common";
import { PlanGalleryComponent } from "../../../plans/pages/plans-page/components/plan-gallery/plan-gallery.component";
import { BasePlanDto } from "../../../plans/models/base-plan-dto";
import { switchMap } from "rxjs";
import { PlanService } from "../../../plans/services/plan.service";
import { PageEvent, MatPaginator } from "@angular/material/paginator";

@Component({
	selector: "app-profile-page",
	imports: [UserImageComponent, DatePipe, PlanGalleryComponent, MatPaginator],
	templateUrl: "./profile-page.component.html",
	styleUrl: "./profile-page.component.css",
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfilePageComponent {
	private userId: string | null = null;
	private isOwner: boolean = false;
	protected userProfile = signal<UserProfile | null>(null);
	protected planList = signal<Array<BasePlanDto>>(new Array());
	protected totalPlans = signal<number>(0);

	constructor(
		private route: ActivatedRoute,
		private navService: NavigationService,
		private authService: AuthService,
		private planService: PlanService,
		private snackbarService: SnackbarService
	) {
		route.paramMap.pipe(takeUntilDestroyed()).subscribe((x) => {
			if (x.get("id") === null || x.get("id")!.length === 0) {
				snackbarService.openSnackBar(
					"User not found!",
					ESnackbarType.INFO,
					2000
				);
				navService.back();
			} else {
				this.userId = x.get("id");

				if (
					this.userId ===
					this.authService.getRequiredUserData().userId
				) {
					this.isOwner = true;
				}
			}
		});
	}

	ngOnInit(): void {
		this.fetchData();
	}

	private fetchData(): void {
		this.authService
			.getUserProfile(this.userId!)
			.pipe(
				switchMap((x) => {
					this.userProfile.set(x.data);

					if (this.isOwner) {
						return this.planService.getOwnerPlans(null, 1, 4);
					} else {
						return this.planService.getPlansByUser(
							this.userId!,
							null
						);
					}
				})
			)
			.subscribe({
				next: (x) => {
					this.planList.set(x.data.data);
					this.totalPlans.set(x.data.totalItems);
				},
			});
	}

	private getUserPlans(page: number) {
		if (this.isOwner) {
			this.planService.getOwnerPlans(null, page, 4).subscribe({
				next: (x) => {
					this.planList.set(x.data.data);
					this.totalPlans.set(x.data.totalItems);
				},
			});
		} else {
			this.planService
				.getPlansByUser(this.userId!, null, page)
				.subscribe({
					next: (x) => {
						this.planList.set(x.data.data);
						this.totalPlans.set(x.data.totalItems);
					},
				});
		}
	}

	protected handlePageEvent(event: PageEvent): void {
		this.getUserPlans(event.pageIndex + 1);
	}
}
