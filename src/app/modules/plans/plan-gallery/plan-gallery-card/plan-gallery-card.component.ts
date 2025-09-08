import { ChangeDetectionStrategy, Component, input } from "@angular/core";
import { IPlan } from "../../../../core/models/domain/plan/plan";
import { DatePipe } from "@angular/common";

@Component({
	selector: "app-plan-gallery-card",
	imports: [DatePipe],
	templateUrl: "./plan-gallery-card.component.html",
	styleUrl: "./plan-gallery-card.component.css",
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlanGalleryCardComponent {
	public plan = input.required<IPlan>();
}
