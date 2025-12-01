import {
	ChangeDetectionStrategy,
	Component,
	signal,
	ViewChild,
} from "@angular/core";
import { TextInputComponent } from "../../../../shared/components/inputs/text-input/text-input.component";
import { PlanFilterComponent } from "./components/plan-filter/plan-filter.component";
import { DropdownComponent } from "../../../../shared/components/dropdowns/dropdown/dropdown.component";
import { PlanGalleryComponent } from "./components/plan-gallery/plan-gallery.component";
import { FormControl, FormsModule, ReactiveFormsModule } from "@angular/forms";
import { IPlanFilterData } from "../../../../core/models/utils/plan/plan-filter-data.interface";
import { IValueOption } from "../../../../shared/models/utils/value-option";
import { BehaviorSubject, Observable } from "rxjs";
import { Plan } from "../../../../core/models/domain/plan/plan";
import { takeUntilDestroyed, toSignal } from "@angular/core/rxjs-interop";
import { ActivatedRoute, Router } from "@angular/router";
import { PlanPageType } from "../../../../shared/enums/plan-page-type";
import { GeneralUtils } from "../../../../shared/utils/general-utils";
import { EPlanFilterType } from "../../../../shared/enums/plan-filter-type-enum";
import { BorderButtonComponent } from "../../../../shared/components/buttons/border-button/border-button.component";
import { MatDialog } from "@angular/material/dialog";
import { CreateAPlanPopupComponent } from "../../popups/create-a-plan-popup/create-a-plan-popup.component";
import { PlanService } from "../../services/plan.service";
import { BasePlanDto } from "../../models/base-plan-dto";
import { PlanQuery } from "../../models/plan-query";
import { PaginatedApiResponse } from "../../../../core/models/api/paginated-api-response";
import { SnackbarService } from "../../../../core/services/snackbar/snackbar.service";
import { ESnackbarType } from "../../../../core/models/utils/others/snackbar-type.enum";
import { PageEvent, MatPaginatorModule } from "@angular/material/paginator";

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
		MatPaginatorModule,
	],
	templateUrl: "./plans-page.component.html",
	styleUrl: "./plans-page.component.css",
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlansPageComponent {
	protected planPageType: PlanPageType | null = null;
	protected readonly PLAN_FILTER_TYPE_LIST: Array<IValueOption> =
		GeneralUtils.getOptionList(EPlanFilterType);
	protected planList = signal<Array<BasePlanDto>>(new Array());
	private planFilterData: IPlanFilterData | null = null;
	private planFilterType: IValueOption | null = this.PLAN_FILTER_TYPE_LIST[0];
	protected nameFilter: FormControl = new FormControl<string>("");

	constructor(
		private route: ActivatedRoute,
		private dialog: MatDialog,
		private planService: PlanService,
		private snackbarService: SnackbarService,
		private router: Router
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
		var serviceCall: Observable<PaginatedApiResponse<Array<BasePlanDto>>>;

		switch (this.planPageType) {
			case PlanPageType.BROWSE_PLANS:
				serviceCall = this.planService.browsePlans(null, 1);
				break;
			case PlanPageType.YOUR_PLANS:
				serviceCall = this.planService.getOwnerPlans(null, 1);
				break;
			case PlanPageType.PINNED_PLANS:
				serviceCall = this.planService.getPinnedPlans(null, 1);
				break;
			default:
				this.snackbarService.openSnackBar(
					"Failed to get plans! Please try again later.",
					ESnackbarType.ERROR
				);
				this.router.navigateByUrl("/home");
				return;
		}

		serviceCall.subscribe({
			next: (response) => {
				this.planList.set(response.data.data);
			},
		});
	}

	ngOnDestroy(): void {
		this.planPageType = null;
	}

	protected get PlanPageType() {
		return PlanPageType;
	}

	protected filterPlans(page: number = 1) {
		const query: PlanQuery = {
			Search: this.nameFilter.value,
			Destination: this.planFilterData?.destinationFilter ?? null,
			DateStart:
				this.planFilterData?.startDateFilter?.toISOString() ?? null,
			DateEnd: this.planFilterData?.endDateFilter?.toISOString() ?? null,
			Days: this.planFilterData?.daysFilter ?? null,
			OrderBy: this.planFilterType
				? this.PLAN_FILTER_TYPE_LIST.indexOf(this.planFilterType!)
				: 1,
		};

		var serviceCall: Observable<PaginatedApiResponse<Array<BasePlanDto>>>;

		switch (this.planPageType) {
			case PlanPageType.BROWSE_PLANS:
				serviceCall = this.planService.browsePlans(query, page);
				break;
			case PlanPageType.YOUR_PLANS:
				serviceCall = this.planService.getOwnerPlans(query, page);
				break;
			case PlanPageType.PINNED_PLANS:
				serviceCall = this.planService.getPinnedPlans(query, page);
				break;
			default:
				this.snackbarService.openSnackBar(
					"Failed to get plans! Please try again later.",
					ESnackbarType.ERROR
				);
				this.router.navigateByUrl("/home");
				return;
		}

		serviceCall.subscribe({
			next: (response) => {
				this.planList.set(response.data.data);
			},
		});
	}

	protected onFilter(planFilterData: IPlanFilterData): void {
		this.planFilterData = planFilterData;
		this.filterPlans();
	}

	protected onPlanFilterTypeSelected(
		planFilterType: IValueOption | null
	): void {
		this.planFilterType = planFilterType;
		this.filterPlans();
	}

	protected openCreatePlanPopup() {
		this.dialog.open(CreateAPlanPopupComponent, {
			minWidth: "35%",
			maxHeight: "80%",
		});
	}

	protected handlePageEvent(event: PageEvent): void {
		this.filterPlans(event.pageIndex + 1);
	}
}
