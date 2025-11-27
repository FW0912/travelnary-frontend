import { ChangeDetectionStrategy, Component, input } from "@angular/core";
import { Plan } from "../../../../../../../core/models/domain/plan/plan";
import { DatePipe } from "@angular/common";
import { Router } from "@angular/router";
import { BasePlanDto } from "../../../../../models/base-plan-dto";
import { LocalStorageService } from "../../../../../../../core/services/local-storage/local-storage.service";
import { AuthService } from "../../../../../../../core/services/auth/auth.service";

@Component({
	selector: "app-plan-gallery-card",
	imports: [DatePipe],
	templateUrl: "./plan-gallery-card.component.html",
	styleUrl: "./plan-gallery-card.component.css",
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlanGalleryCardComponent {
	public plan = input.required<BasePlanDto>();

	constructor(private router: Router) {}

	protected navigateToPlanPage() {
		this.router.navigateByUrl(`/view-plan/${this.plan().id}`);
	}
}
