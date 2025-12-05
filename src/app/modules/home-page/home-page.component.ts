import {
	ChangeDetectionStrategy,
	Component,
	effect,
	signal,
} from "@angular/core";
import { ButtonComponent } from "../../shared/components/buttons/button/button.component";
import { AuthService } from "../../core/services/auth/auth.service";
import { BasePlanDto } from "../plans/models/base-plan-dto";
import { PlanService } from "../plans/services/plan.service";
import { LinkComponent } from "../../shared/components/link/link.component";
import { PlanGalleryComponent } from "../plans/pages/plans-page/components/plan-gallery/plan-gallery.component";

@Component({
	selector: "app-home-page",
	imports: [ButtonComponent, LinkComponent, PlanGalleryComponent],
	templateUrl: "./home-page.component.html",
	styleUrl: "./home-page.component.css",
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomePageComponent {
	protected pinnedPlanList = signal<Array<BasePlanDto>>(new Array());
	protected ownerPlanList = signal<Array<BasePlanDto>>(new Array());

	constructor(
		protected authService: AuthService,
		private planService: PlanService
	) {
		effect(() => {
			const isLoggedIn = authService.isLoggedIn();

			if (isLoggedIn) {
				this.planService.getPinnedPlans(null, 1, 4).subscribe({
					next: (x) => {
						this.pinnedPlanList.set(x.data.data);
					},
				});

				this.planService.getOwnerPlans(null, 1, 4).subscribe({
					next: (x) => {
						this.ownerPlanList.set(x.data.data);
					},
				});
			}
		});
	}
}
