import { PlanUtils } from "./../../shared/utils/plan-utils";
import { Component } from "@angular/core";
import { TextInputComponent } from "../../shared/components/inputs/text-input/text-input.component";
import { PlanFilterComponent } from "../../shared/components/plan/plan-filter/plan-filter.component";
import { IPlan } from "../../core/models/domain/plan/plan";
import { BehaviorSubject } from "rxjs";
import { IPlanFilterData } from "../../core/models/utils/plan/plan-filter-data";
import { DropdownComponent } from "../../shared/components/dropdown/dropdown.component";
import { IValueOption } from "../../shared/models/utils/value-option";

@Component({
	selector: "app-browse-plans-page",
	imports: [TextInputComponent, PlanFilterComponent, DropdownComponent],
	templateUrl: "./browse-plans-page.component.html",
	styleUrl: "./browse-plans-page.component.css",
})
export class BrowsePlansPageComponent {
	protected readonly PLAN_FILTER_TYPE_LIST =
		PlanUtils.getPlanFilterTypeOptionList();
	protected planList: BehaviorSubject<Array<IPlan>> = new BehaviorSubject(
		new Array()
	);
	protected nameFilter: string = "";

	ngOnInit() {
		this.planList.next(
			new Array(
				{
					id: "c7cd31be-f6cb-4811-9cd3-ee376a1b14d7",
					user: {
						id: "c43d557b-12af-4a8f-908c-9e13306bad2b",
						name: "Andre Valas",
					},
					currency: {
						id: "9528ad4c-1202-475a-866d-7a35132dc204",
						name: "IDR",
					},
					name: "Trip with David",
					description: "",
					destination: "United Kingdom, London",
					date_start: new Date("2025-09-07"),
					date_end: new Date("2025-09-13"),
				},
				{
					id: "4e17c13b-6b62-4c73-bfe2-9386cf7c570c",
					user: {
						id: "c43d557b-12af-4a8f-908c-9e13306bad2b",
						name: "Andre Valas",
					},
					currency: {
						id: "9528ad4c-1202-475a-866d-7a35132dc204",
						name: "IDR",
					},
					name: "Greece Sightseeing",
					description:
						"Great trip to look at Greece scenery, including the food scene and history",
					destination: "Greece",
					date_start: new Date("2025-07-01"),
					date_end: new Date("2025-07-04"),
				}
			)
		);
	}

	protected onFilter(planFilterData: IPlanFilterData) {
		console.log(planFilterData);
	}

	protected onPlanFilterTypeSelected(planFilterType: IValueOption) {
		console.log(planFilterType);
	}
}
