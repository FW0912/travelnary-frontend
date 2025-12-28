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
import { DateRangeInputComponent } from "../../../../shared/components/inputs/date-range-input/date-range-input.component";
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
import { ImageService } from "../../../image/services/image.service";
import { PlanService } from "../../services/plan.service";
import { Observable, switchMap } from "rxjs";
import { ModifyPlanDto } from "../../models/modify-plan-dto";
import { Router } from "@angular/router";
import { ApiResponse } from "../../../../core/models/api/api-response";

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
		DateRangeInputComponent,
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
	protected editorToken: string | null = null;
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
	protected initialCurrencyType = signal<IValueOption | null>(null);
	protected currencyTypeList = signal<Array<IValueOption>>(new Array());

	constructor(
		private fb: FormBuilder,
		@Inject(MAT_DIALOG_DATA)
		private data: {
			plan: GetPlanByIdDto;
			editorToken: string | null;
		},
		private currencyService: CurrencyService,
		private imageService: ImageService,
		private planService: PlanService,
		private snackbarService: SnackbarService,
		private router: Router,
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

		if (data.editorToken === undefined) {
			snackbarService.openSnackBar(
				"Can't get Editor token!",
				ESnackbarType.ERROR
			);
			ref.close();
			return;
		}

		this.plan = data.plan;
		this.editorToken = data.editorToken;

		const initialCurrencyType: IValueOption = {
			id: this.plan.currency.id,
			value: this.plan.currency.id,
		};
		this.initialCurrencyType.set(initialCurrencyType);
		this.photoUrl.set(this.plan.photoUrl);

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
				photo: fb.control<File | null>(null),
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
					initialCurrencyType,
					[Validators.required]
				),
				isPublic: fb.control<boolean>(!this.plan.isPrivate),
			})
		);
	}

	protected get planNameControl(): FormControl {
		return this.formGroup.get("planName")! as FormControl;
	}

	protected get planDescriptionControl(): FormControl {
		return this.formGroup.get("planDescription")! as FormControl;
	}

	protected get destinationControl(): FormControl {
		return this.formGroup.get("destination")! as FormControl;
	}

	protected get photoControl(): FormControl<File | null> {
		return this.formGroup.get("photo")! as FormControl;
	}

	protected get dateRangeControl(): FormControl<{
		start: Date | null;
		end: Date | null;
	} | null> {
		return this.formGroup.get("dateRange")! as FormControl;
	}

	protected get currencyTypeControl(): FormControl<IValueOption | null> {
		return this.formGroup.get("currencyType")! as FormControl;
	}

	protected get isPublicControl(): FormControl<boolean> {
		return this.formGroup.get("isPublic")! as FormControl;
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

	private getUpdatePlanObservable(
		body: ModifyPlanDto
	): Observable<ApiResponse<any>> {
		if (this.editorToken) {
			return this.planService.updateSharedPlan(
				this.plan!.id,
				body,
				this.editorToken
			);
		} else {
			return this.planService.updatePlan(this.plan!.id, body);
		}
	}

	protected updatePlan(): void {
		this.submit();

		if (this.formGroup.valid) {
			var observable: Observable<ApiResponse<any>>;

			if (this.photoControl.value !== null) {
				observable = this.imageService
					.upload(this.photoControl.value)
					.pipe(
						switchMap((x) => {
							const body: ModifyPlanDto = {
								name: this.planNameControl.value,
								description: this.planDescriptionControl.value,
								destination: this.destinationControl.value,
								photoUrl: x.data.fileUrl,
								dateStart:
									this.dateRangeControl.value!.start!.toISOString(),
								dateEnd:
									this.dateRangeControl.value!.end!.toISOString(),
								currencyId: this.currencyTypeControl.value!.id,
								isPrivate: !this.isPublicControl.value,
							};

							return this.getUpdatePlanObservable(body);
						})
					);
			} else {
				const body: ModifyPlanDto = {
					name: this.planNameControl.value,
					description: this.planDescriptionControl.value,
					destination: this.destinationControl.value,
					photoUrl: this.plan!.photoUrl,
					dateStart:
						this.dateRangeControl.value!.start!.toISOString(),
					dateEnd: this.dateRangeControl.value!.end!.toISOString(),
					currencyId: this.currencyTypeControl.value!.id,
					isPrivate: !this.isPublicControl.value,
				};

				observable = this.getUpdatePlanObservable(body);
			}

			observable.subscribe({
				next: (x) => {
					this.ref.close(true);
					this.snackbarService.openSnackBar(
						"Plan updated successfully.",
						ESnackbarType.INFO
					);
				},
			});
		}
	}
}
