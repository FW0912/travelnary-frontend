import { ChangeDetectionStrategy, Component, ViewChild } from "@angular/core";
import { TextInputComponent } from "../../../../shared/components/inputs/text-input/text-input.component";
import { PlanFilterComponent } from "./components/plan-filter/plan-filter.component";
import { DropdownComponent } from "../../../../shared/components/dropdowns/dropdown/dropdown.component";
import { PlanGalleryComponent } from "./components/plan-gallery/plan-gallery.component";
import { FormControl, FormsModule, ReactiveFormsModule } from "@angular/forms";
import { IPlanFilterData } from "../../../../core/models/utils/plan/plan-filter-data.interface";
import { IValueOption } from "../../../../shared/models/utils/value-option";
import { BehaviorSubject } from "rxjs";
import { Plan } from "../../../../core/models/domain/plan/plan";
import { takeUntilDestroyed, toSignal } from "@angular/core/rxjs-interop";
import { ActivatedRoute } from "@angular/router";
import { PlanPageType } from "../../../../shared/enums/plan-page-type";
import { GeneralUtils } from "../../../../shared/utils/general-utils";
import { EPlanFilterType } from "../../../../shared/enums/plan-filter-type-enum";
import { BorderButtonComponent } from "../../../../shared/components/buttons/border-button/border-button.component";
import { MatDialog } from "@angular/material/dialog";
import { CreateAPlanPopupComponent } from "../../popups/create-a-plan-popup/create-a-plan-popup.component";
import { PlanService } from "../../services/plan.service";
import { BasePlanDto } from "../../models/base-plan-dto";

@Component({
	selector: "app-plans-page",
	imports: [
		TextInputComponent,
		PlanFilterComponent,
		DropdownComponent,
		PlanGalleryComponent,
		FormsModule,
		ReactiveFormsModule,
		BorderButtonComponent,
	],
	templateUrl: "./plans-page.component.html",
	styleUrl: "./plans-page.component.css",
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlansPageComponent {
	protected planPageType: PlanPageType | null = null;
	protected readonly PLAN_FILTER_TYPE_LIST: Array<IValueOption> =
		GeneralUtils.getOptionList(EPlanFilterType);
	protected observablePlanList: BehaviorSubject<Array<BasePlanDto>> =
		new BehaviorSubject(new Array());
	protected planList = toSignal(this.observablePlanList);
	protected nameFilter: FormControl = new FormControl<string>("");

	constructor(
		private route: ActivatedRoute,
		private dialog: MatDialog,
		private planService: PlanService
	) {
		this.route.url
			.pipe(takeUntilDestroyed())
			.subscribe(
				() =>
					(this.planPageType = this.route.snapshot.url[0]
						.path as PlanPageType)
			);
	}

	ngOnInit(): void {
		switch (this.planPageType) {
			case PlanPageType.YOUR_PLANS:
				break;
			case PlanPageType.BROWSE_PLANS:
				this.planService.browsePlans({}, 1).subscribe({
					next: (response) => {
						this.observablePlanList.next(response.data.data);
					},
				});
				break;
			case PlanPageType.PINNED_PLANS:
				break;
		}
	}

	ngOnDestroy(): void {
		this.planPageType = null;
		this.observablePlanList.complete();
	}

	protected get PlanPageType() {
		return PlanPageType;
	}

	protected onFilter(planFilterData: IPlanFilterData): void {
		console.log(planFilterData);
	}

	protected onPlanFilterTypeSelected(
		planFilterType: IValueOption | null
	): void {
		console.log(planFilterType);
	}

	protected openCreatePlanPopup() {
		this.dialog.open(CreateAPlanPopupComponent, {
			minWidth: "35%",
			maxHeight: "80%",
		});
	}
}
