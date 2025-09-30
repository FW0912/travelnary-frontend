import { ChangeDetectionStrategy, Component, ViewChild } from "@angular/core";
import { TextInputComponent } from "../../../../shared/components/inputs/text-input/text-input.component";
import { PlanFilterComponent } from "./components/plan-filter/plan-filter.component";
import { DropdownComponent } from "../../../../shared/components/dropdowns/dropdown/dropdown.component";
import { PlanGalleryComponent } from "./components/plan-gallery/plan-gallery.component";
import { FormControl, FormsModule, ReactiveFormsModule } from "@angular/forms";
import { IPlanFilterData } from "../../../../core/models/utils/plan/plan-filter-data.interface";
import { IValueOption } from "../../../../shared/models/utils/value-option";
import { PlanUtils } from "../../../../shared/utils/plan-utils";
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
	protected observablePlanList: BehaviorSubject<Array<Plan>> =
		new BehaviorSubject(new Array());
	protected planList = toSignal(this.observablePlanList);
	protected nameFilter: FormControl = new FormControl<string>("");

	constructor(private route: ActivatedRoute, private dialog: MatDialog) {
		this.route.url
			.pipe(takeUntilDestroyed())
			.subscribe(
				() =>
					(this.planPageType = this.route.snapshot.url[0]
						.path as PlanPageType)
			);
	}

	ngOnInit(): void {
		this.observablePlanList.next(
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
					updated_on: new Date("2025-04-27"),
					like_count: 0,
					view_count: 11,
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
					updated_on: new Date("2025-05-03"),
					like_count: 70,
					view_count: 290,
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
					updated_on: new Date("2025-05-03"),
					like_count: 70,
					view_count: 290,
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
					updated_on: new Date("2025-05-03"),
					like_count: 70,
					view_count: 290,
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
					updated_on: new Date("2025-05-03"),
					like_count: 70,
					view_count: 290,
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
					updated_on: new Date("2025-05-03"),
					like_count: 70,
					view_count: 290,
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
					updated_on: new Date("2025-05-03"),
					like_count: 70,
					view_count: 290,
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
					updated_on: new Date("2025-05-03"),
					like_count: 70,
					view_count: 290,
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
					updated_on: new Date("2025-05-03"),
					like_count: 70,
					view_count: 290,
				}
			)
		);
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
