import {
	ChangeDetectionStrategy,
	Component,
	computed,
	Inject,
	signal,
} from "@angular/core";
import { BasePopupComponent } from "../../../base-popup/base-popup.component";
import {
	MAT_DIALOG_DATA,
	MatDialogActions,
	MatDialogContent,
	MatDialogRef,
} from "@angular/material/dialog";
import {
	FormBuilder,
	FormControl,
	ReactiveFormsModule,
	Validators,
} from "@angular/forms";
import { BorderButtonComponent } from "../../../../shared/components/buttons/border-button/border-button.component";
import { ButtonComponent } from "../../../../shared/components/buttons/button/button.component";
import { SearchableDropdownComponent } from "../../../../shared/components/dropdowns/searchable-dropdown/searchable-dropdown.component";
import { ErrorMessageWrapperComponent } from "../../../../shared/components/error-message-wrapper/error-message-wrapper.component";
import { DateInputComponent } from "../../../../shared/components/inputs/date-input/date-input.component";
import { DestinationSearchComponent } from "../../../../shared/components/inputs/destination-search/destination-search.component";
import { TextAreaComponent } from "../../../../shared/components/inputs/text-area/text-area.component";
import { TextInputComponent } from "../../../../shared/components/inputs/text-input/text-input.component";
import { BaseFormComponent } from "../../../base-form-page/base-form-page.component";
import { UtilsService } from "../../../../core/services/utils/utils.service";
import { CurrencyType } from "../../../../shared/enums/currency-type";
import { IValueOption } from "../../../../shared/models/utils/value-option";
import { GeneralUtils } from "../../../../shared/utils/general-utils";
import { DateValidators } from "../../../../shared/validators/date/date-validators";
import { Plan } from "../../../../core/models/domain/plan/plan";
import { SnackbarService } from "../../../../core/services/snackbar/snackbar.service";
import { ESnackbarType } from "../../../../core/models/utils/others/snackbar-type.enum";
import { CurrencyService } from "../../../currency/services/currency.service";
import { GetPlanByIdDto } from "../../models/get-plan-by-id-dto";

@Component({
	selector: "app-edit-plan-popup",
	imports: [
		BasePopupComponent,
		MatDialogContent,
		MatDialogActions,
		TextInputComponent,
		ReactiveFormsModule,
		TextAreaComponent,
		DestinationSearchComponent,
		BorderButtonComponent,
		DateInputComponent,
		ButtonComponent,
		SearchableDropdownComponent,
		ErrorMessageWrapperComponent,
	],
	templateUrl: "./edit-plan-popup.component.html",
	styleUrl: "./edit-plan-popup.component.css",
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditPlanPopupComponent extends BaseFormComponent {
	protected plan: GetPlanByIdDto | null = null;
	protected uploadError = signal<boolean>(false);
	protected uploadButtonClasses = computed(() => {
		const base: string = "w-full";
		const uploadError = this.uploadError();
		const photoUrl = this.photoUrl();

		if (uploadError) {
			return base.concat(" ", "!border-error");
		}

		if (photoUrl) {
			return "";
		}

		return base;
	});
	protected photoUrl = signal<string | null>(null);
	protected currencyTypeList = signal<Array<IValueOption>>(new Array());

	constructor(
		private fb: FormBuilder,
		@Inject(MAT_DIALOG_DATA)
		private data: {
			plan: GetPlanByIdDto;
		},
		private currencyService: CurrencyService,
		private snackbarService: SnackbarService,
		private ref: MatDialogRef<EditPlanPopupComponent>
	) {
		super();

		if (!data || !data.plan) {
			snackbarService.openSnackBar(
				"Can't get Plan details!",
				ESnackbarType.ERROR
			);
			ref.close();
			return;
		}

		this.plan = data.plan;

		this.setFormGroup(
			fb.group({
				planName: fb.control<string>(this.plan.name, [
					Validators.required,
					Validators.minLength(5),
				]),
				planDescription: fb.control<string>(this.plan.description),
				destination: fb.control<string>(this.plan.destination, [
					Validators.required,
				]),
				photo: fb.control<File | null>(new File([], ""), [
					Validators.required,
				]),
				dateRange: this.fb.control<{
					start: Date | null;
					end: Date | null;
				} | null>(
					{
						start: new Date(this.plan.dateStart),
						end: new Date(this.plan.dateEnd),
					},
					[Validators.required, DateValidators.validateDateRange]
				),
				currencyType: fb.control<IValueOption | null>(
					{
						id: this.plan.currency.id,
						value: this.plan.currency.name,
					},
					[Validators.required]
				),
				isPublic: fb.control<boolean>(false),
			})
		);
	}

	protected get photoControl(): FormControl {
		return this.formGroup.get("photo")! as FormControl;
	}

	protected get currencyTypeControl(): FormControl {
		return this.formGroup.get("currencyType")! as FormControl;
	}

	ngOnInit(): void {
		this.currencyService.getAllCurrency().subscribe({
			next: (x) => {
				this.currencyTypeList.set(
					x.data.map((y) => {
						return {
							id: y.id,
							value: y.id,
						};
					})
				);
			},
		});
	}

	protected onCurrencyTypeSelected(currencyType: IValueOption | null) {
		this.formGroup.get("currencyType")!.setValue(currencyType);
	}

	protected onUploadFile(event: Event): void {
		const target = event.target! as HTMLInputElement;

		if (target.files !== null && target.files.item(0) !== null) {
			this.uploadError.set(false);
			this.formGroup.get("photo")!.setValue(target.files.item(0)!);

			const fileReader: FileReader = new FileReader();

			fileReader.onload = (event) => {
				this.photoUrl.set(event.target!.result as string);
			};

			fileReader.readAsDataURL(target.files.item(0)!);
		} else {
			this.uploadError.set(true);
			this.formGroup.get("photo")!.setValue(null);
			this.photoUrl.set(null);
		}
	}

	protected createPlan(): void {
		this.submit();

		if (this.formGroup.valid) {
			console.log(this.formGroup);
		}
	}
}
