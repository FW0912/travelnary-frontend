import {
	ChangeDetectionStrategy,
	Component,
	HostBinding,
	output,
} from "@angular/core";
import { TextInputComponent } from "../../../../../../shared/components/inputs/text-input/text-input.component";
import { DateInputComponent } from "../../../../../../shared/components/inputs/date-input/date-input.component";
import { ButtonComponent } from "../../../../../../shared/components/buttons/button/button.component";
import { BorderButtonComponent } from "../../../../../../shared/components/buttons/border-button/border-button.component";
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { DestinationSearchComponent } from "../../../../../../shared/components/inputs/destination-search/destination-search.component";
import { BaseFormComponent } from "../../../../../base-form-page/base-form-page.component";
import { IPlanFilterData } from "../../../../../../core/models/utils/plan/plan-filter-data.interface";
import { DateValidators } from "../../../../../../shared/validators/date/date-validators";
import { UtilsService } from "../../../../../../core/services/utils/utils.service";
import { SnackbarService } from "../../../../../../core/services/snackbar/snackbar.service";

@Component({
	selector: "app-plan-filter",
	imports: [
		TextInputComponent,
		DateInputComponent,
		ButtonComponent,
		BorderButtonComponent,
		ReactiveFormsModule,
		DestinationSearchComponent,
	],
	templateUrl: "./plan-filter.component.html",
	styleUrl: "./plan-filter.component.css",
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlanFilterComponent extends BaseFormComponent {
	@HostBinding("class") hostClasses: string = "w-3/4 md:w-1/5 md:pt-28";
	public onFilter = output<IPlanFilterData>();

	constructor(
		private fb: FormBuilder,
		private utilsService: UtilsService,
		private snackbarService: SnackbarService
	) {
		super();

		this.setFormGroup(
			this.fb.group({
				destinationFilter: this.fb.control<string>(""),
				dateFilter: this.fb.control<{
					start: Date | null;
					end: Date | null;
				} | null>(null, [DateValidators.validateDateRange]),
				daysFilter: this.fb.control<string>("", [
					Validators.min(0),
					Validators.max(30),
				]),
			})
		);
	}

	private get destinationFilter(): string {
		return this.formGroup.get("destinationFilter")!.value;
	}

	private get startDateFilter(): Date | null {
		if (this.formGroup.get("dateFilter")!.value === null) {
			return null;
		}

		return this.formGroup.get("dateFilter")!.value.start;
	}

	private get endDateFilter(): Date | null {
		if (this.formGroup.get("dateFilter")!.value === null) {
			return null;
		}

		return this.formGroup.get("dateFilter")!.value.end;
	}

	private get daysFilter(): string {
		return this.formGroup.get("daysFilter")!.value;
	}

	protected filterPlanList(): void {
		console.log(this.formGroup);

		this.onFilter.emit({
			destinationFilter: this.destinationFilter,
			startDateFilter: this.startDateFilter,
			endDateFilter: this.endDateFilter,
			daysFilter:
				this.daysFilter === ""
					? null
					: Number.parseInt(this.daysFilter),
		});
	}

	public clearFilters(): void {
		this.formGroup.patchValue({
			destinationFilter: "",
			dateFilter: { start: null, end: null },
			daysFilter: "",
		});
	}
}
