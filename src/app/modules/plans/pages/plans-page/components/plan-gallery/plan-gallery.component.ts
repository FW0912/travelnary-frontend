import { ChangeDetectionStrategy, Component, input } from "@angular/core";
import { Plan } from "../../../../../../core/models/domain/plan/plan";
import { PlanGalleryCardComponent } from "./plan-gallery-card/plan-gallery-card.component";
import { BasePlanDto } from "../../../../models/base-plan-dto";

@Component({
	selector: "app-plan-gallery",
	imports: [PlanGalleryCardComponent],
	templateUrl: "./plan-gallery.component.html",
	styleUrl: "./plan-gallery.component.css",
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlanGalleryComponent {
	public planList = input.required<Array<BasePlanDto>>();
}
