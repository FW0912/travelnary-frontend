import { Component, Input, model, output } from "@angular/core";
import { DateInputComponent } from "../../inputs/date-input/date-input.component";
import { TextInputComponent } from "../../inputs/text-input/text-input.component";
import { UtilsService } from "../../../../core/services/utils/utils.service";
import { BehaviorSubject, Observable } from "rxjs";
import { ButtonComponent } from "../../buttons/button/button.component";
import { BorderButtonComponent } from "../../buttons/border-button/border-button.component";
import { IPlan } from "../../../../core/models/domain/plan/plan";
import { SnackbarService } from "../../../../core/services/snackbar/snackbar.service";
import { ESnackbarType } from "../../../../core/models/utils/others/snackbar-type-enum";
import { IPlanFilterData } from "../../../../core/models/utils/plan/plan-filter-data";
import { IValueOption } from "../../../models/utils/value-option";

@Component({
	selector: "app-plan-filter",
	imports: [
		TextInputComponent,
		DateInputComponent,
		ButtonComponent,
		BorderButtonComponent,
	],
	templateUrl: "./plan-filter.component.html",
	styleUrl: "./plan-filter.component.css",
})
export class PlanFilterComponent {
	public destinationFilter: string = "";
	protected destinationOptionList: Array<IValueOption> = new Array();
	protected filteredDestinationOptionList: BehaviorSubject<
		Array<IValueOption>
	> = new BehaviorSubject(new Array());
	public startDateFilter: Date | null = null;
	public endDateFilter: Date | null = null;
	public daysFilter: string = "";
	public onFilter = output<IPlanFilterData>();

	constructor(
		private utilsService: UtilsService,
		private snackbarService: SnackbarService
	) {}

	ngOnInit() {
		this.utilsService
			.readJsonAsset("/assets/countries.min.json")
			.subscribe((data) => {
				const concatCountryAndCity: Array<{
					id: number;
					value: string;
				}> = Array.from(
					new Set<string>(
						Object.keys(data)
							.map((x) =>
								new Array(x).concat(
									data[x].map((y: string) =>
										y.concat(", ", x)
									)
								)
							)
							.reduce((a: Array<string>, b: Array<string>) =>
								a.concat(b)
							)
					)
				).map((x, i) => {
					return {
						id: i + 1,
						value: x,
					};
				});

				this.destinationOptionList = concatCountryAndCity;
				this.filteredDestinationOptionList.next(
					concatCountryAndCity.slice(0, 20)
				);
			});
	}

	protected filterDestinationAutocomplete(): void {
		this.filteredDestinationOptionList.next(
			this.destinationOptionList
				.filter((x) =>
					x.value
						.toLowerCase()
						.includes(this.destinationFilter.toLowerCase())
				)
				.slice(0, 20)
		);
	}

	private validateFilters(): boolean {
		if (this.daysFilter.length === 0) {
			return true;
		}

		if (isNaN(Number.parseInt(this.daysFilter))) {
			this.snackbarService.openSnackBar(
				"Number of days must be a valid integer!",
				ESnackbarType.ERROR
			);
			return false;
		}

		if (Number.parseInt(this.daysFilter) <= 0) {
			this.snackbarService.openSnackBar(
				"Number of days must be more than 0!",
				ESnackbarType.ERROR
			);
			return false;
		}

		return true;
	}

	protected filterPlanList(): void {
		if (!this.validateFilters()) {
			return;
		}

		this.onFilter.emit({
			destinationFilter: this.destinationFilter,
			startDateFilter: this.startDateFilter,
			endDateFilter: this.endDateFilter,
			daysFilter: Number.parseInt(this.daysFilter),
		});
	}

	clearFilters() {
		this.destinationFilter = "";
		this.filteredDestinationOptionList.next(
			this.destinationOptionList.slice(0, 20)
		);
		this.startDateFilter = null;
		this.endDateFilter = null;
		this.daysFilter = "";
	}
}
