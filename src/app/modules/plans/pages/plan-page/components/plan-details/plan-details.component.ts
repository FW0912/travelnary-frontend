import {
	ChangeDetectionStrategy,
	Component,
	effect,
	input,
	output,
	signal,
} from "@angular/core";
import { CommonModule, DatePipe, DecimalPipe } from "@angular/common";
import { UserImageComponent } from "../../../../../../shared/components/images/user-image/user-image.component";
import { DefaultImageComponent } from "../../../../../../shared/components/images/default-image/default-image.component";
import { GetPlanByIdDto } from "../../../../models/get-plan-by-id-dto";
import { Router } from "@angular/router";
import { AuthService } from "../../../../../../core/services/auth/auth.service";

@Component({
	selector: "app-plan-details",
	imports: [
		DatePipe,
		CommonModule,
		UserImageComponent,
		DefaultImageComponent,
		DecimalPipe,
	],
	templateUrl: "./plan-details.component.html",
	styleUrl: "./plan-details.component.css",
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlanDetailsComponent {
	public plan = input.required<GetPlanByIdDto>();
	public estimatedCost = input.required<number>();
	public pinToggled = output<void>();

	constructor(private router: Router, protected authService: AuthService) {}

	protected navigateToOwnerProfile(): void {
		if (this.plan()) {
			this.router.navigateByUrl(`/profile/${this.plan()!.owner.id}`);
		}
	}

	protected togglePin(): void {
		this.pinToggled.emit();
	}
}
