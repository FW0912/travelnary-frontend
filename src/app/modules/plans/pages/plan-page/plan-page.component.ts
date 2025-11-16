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

	protected plan = signal<Plan>({
		id: "6b17e11f-133d-4dae-9720-44e96d8d105e",
		user: {
			id: "7c39e6f8-abaf-412a-bf32-07d686500d0a",
			name: "Cheryl",
		},
		currency: {
			id: "c250b6c8-2eaa-419c-8a91-4bd38c760581",
			name: "IDR",
		},
		name: "Bahamas Trip",
		description:
			"Trip to the Bahamas, remember to bring sunscreen and sunglasses",
		destination: "Bahamas",
		date_start: new Date("2025-05-21"),
		date_end: new Date("2025-05-24"),
		updated_on: new Date("2025-05-17"),
		is_owner: true,
		is_pinned: false,
		is_liked: false,
		like_count: 15,
		view_count: 112,
	});

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
		private dialog: MatDialog
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
		this.plan.update((x) => {
			x.is_pinned = !x.is_pinned;
			return x;
		});
	}

	protected toggleLike(): void {
		this.plan.update((x) => {
			x.is_liked = !x.is_liked;
			return x;
		});
	}

	protected openSharePlanPopup(): void {
		this.dialog.open(SharePlanPopupComponent, {
			minWidth: "35%",
			maxHeight: "80%",
			data: {
				isOwner: this.plan().is_owner,
			},
		});
	}

	protected openDeletePopup(): void {
		const ref = this.dialog.open(ConfirmationPopupComponent, {
			minWidth: "35%",
		});

		ref.afterClosed().subscribe((x) => console.log(x));
	}

	protected onLocationSort(event: {
		day: number;
		locationList: Array<Location>;
	}) {
		this.locationList.set(event.locationList);
	}
}
