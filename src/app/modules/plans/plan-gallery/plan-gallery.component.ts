import { ChangeDetectionStrategy, Component, input } from "@angular/core";
import { IPlan } from "../../../core/models/domain/plan/plan";
import { PlanGalleryCardComponent } from "./plan-gallery-card/plan-gallery-card.component";

@Component({
	selector: "app-plan-gallery",
	imports: [PlanGalleryCardComponent],
	templateUrl: "./plan-gallery.component.html",
	styleUrl: "./plan-gallery.component.css",
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlanGalleryComponent {
	public planList = input.required<Array<IPlan>>();
}
