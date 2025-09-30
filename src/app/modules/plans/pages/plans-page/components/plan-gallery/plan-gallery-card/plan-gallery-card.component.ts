import { ChangeDetectionStrategy, Component, input } from "@angular/core";
import { Plan } from "../../../../../../../core/models/domain/plan/plan";
import { DatePipe } from "@angular/common";
import { Router } from "@angular/router";

@Component({
	selector: "app-plan-gallery-card",
	imports: [DatePipe],
	templateUrl: "./plan-gallery-card.component.html",
	styleUrl: "./plan-gallery-card.component.css",
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlanGalleryCardComponent {
	public plan = input.required<Plan>();

	constructor(private router: Router) {}

	protected navigateToPlanPage() {
		this.router.navigateByUrl(`/view-plan/${this.plan().id}`);
	}
}
