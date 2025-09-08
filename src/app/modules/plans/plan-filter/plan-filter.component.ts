import {
	ChangeDetectionStrategy,
	Component,
	HostBinding,
	Input,
	model,
	output,
	signal,
} from "@angular/core";
import { DateInputComponent } from "../../../shared/components/inputs/date-input/date-input.component";
import { TextInputComponent } from "../../../shared/components/inputs/text-input/text-input.component";
import { UtilsService } from "../../../core/services/utils/utils.service";
import {
	BehaviorSubject,
	debounceTime,
	Observable,
	Subject,
	Subscription,
} from "rxjs";
import { ButtonComponent } from "../../../shared/components/buttons/button/button.component";
import { BorderButtonComponent } from "../../../shared/components/buttons/border-button/border-button.component";
import { IPlan } from "../../../core/models/domain/plan/plan";
import { SnackbarService } from "../../../core/services/snackbar/snackbar.service";
import { ESnackbarType } from "../../../core/models/utils/others/snackbar-type.enum";
import { IPlanFilterData } from "../../../core/models/utils/plan/plan-filter-data.interface";
import { IValueOption } from "../../../shared/models/utils/value-option";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";

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
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlanFilterComponent {
	@HostBinding("class") hostClasses: string = "w-3/4 md:w-1/5 md:pt-28";

	protected destinationFilter = signal<string>("");
	private destinationFilterSubject: Subject<string> = new Subject<string>();
	protected destinationOptionList: Array<IValueOption> = new Array();
	protected filteredDestinationOptionList = new BehaviorSubject(new Array());
	protected startDateFilter = signal<Date | null>(null);
	protected endDateFilter = signal<Date | null>(null);
	protected daysFilter = signal<string>("");
	public onFilter = output<IPlanFilterData>();

	constructor(
		private utilsService: UtilsService,
		private snackbarService: SnackbarService
	) {
		this.destinationFilterSubject
			.pipe(takeUntilDestroyed(), debounceTime(300))
			.subscribe(() => this.filterDestinationAutocomplete());
	}

	ngOnInit(): void {
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

	ngOnDestroy(): void {
		this.destinationFilterSubject.complete();
		this.filteredDestinationOptionList.complete();
	}

	protected onDestinationFilterChanged(): void {
		this.destinationFilterSubject.next(this.destinationFilter());
	}

	protected filterDestinationAutocomplete(): void {
		this.filteredDestinationOptionList.next(
			this.destinationOptionList
				.filter((x) =>
					x.value
						.toLowerCase()
						.includes(this.destinationFilter().toLowerCase())
				)
				.slice(0, 20)
		);
	}

	private validateFilters(): boolean {
		if (this.daysFilter.length === 0) {
			return true;
		}

		if (isNaN(Number.parseInt(this.daysFilter()))) {
			this.snackbarService.openSnackBar(
				"Number of days must be a valid integer!",
				ESnackbarType.ERROR
			);
			return false;
		}

		if (Number.parseInt(this.daysFilter()) <= 0) {
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
			destinationFilter: this.destinationFilter(),
			startDateFilter: this.startDateFilter(),
			endDateFilter: this.endDateFilter(),
			daysFilter: Number.parseInt(this.daysFilter()),
		});
	}

	protected clearFilters(): void {
		this.destinationFilter.set("");
		this.filteredDestinationOptionList.next(
			this.destinationOptionList.slice(0, 20)
		);
		this.startDateFilter.set(null);
		this.endDateFilter.set(null);
		this.daysFilter.set("");
	}
}
