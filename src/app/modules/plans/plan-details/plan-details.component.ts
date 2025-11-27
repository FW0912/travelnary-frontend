import {
	ChangeDetectionStrategy,
	Component,
	effect,
	input,
	output,
	signal,
} from "@angular/core";
import { Plan } from "../../../core/models/domain/plan/plan";
import { CommonModule, DatePipe } from "@angular/common";
import { GetPlanByIdDto } from "../models/get-plan-by-id-dto";

@Component({
	selector: "app-plan-details",
	imports: [DatePipe, CommonModule],
	templateUrl: "./plan-details.component.html",
	styleUrl: "./plan-details.component.css",
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlanDetailsComponent {
	public plan = input.required<GetPlanByIdDto>();
	public pinToggled = output<void>();

	protected togglePin(): void {
		this.pinToggled.emit();
	}
}
