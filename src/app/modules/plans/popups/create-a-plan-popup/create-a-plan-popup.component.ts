import {
	ChangeDetectionStrategy,
	Component,
	computed,
	signal,
	ViewChild,
} from "@angular/core";
import { BasePopupComponent } from "../../../base-popup/base-popup.component";
import { MatDialogContent, MatDialogRef } from "@angular/material/dialog";
import { MatDialogActions } from "@angular/material/dialog";
import { TextInputComponent } from "../../../../shared/components/inputs/text-input/text-input.component";
import { BaseFormComponent } from "../../../base-form-page/base-form-page.component";
import {
	FormBuilder,
	FormControl,
	ReactiveFormsModule,
	ValidationErrors,
	Validators,
} from "@angular/forms";
import { TextAreaComponent } from "../../../../shared/components/inputs/text-area/text-area.component";
import { UtilsService } from "../../../../core/services/utils/utils.service";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { DestinationSearchComponent } from "../../../../shared/components/inputs/destination-search/destination-search.component";
import { BorderButtonComponent } from "../../../../shared/components/buttons/border-button/border-button.component";
import { NgOptimizedImage } from "@angular/common";
import { DateValidators } from "../../../../shared/validators/date/date-validators";
import { DateInputComponent } from "../../../../shared/components/inputs/date-input/date-input.component";
import { DropdownComponent } from "../../../../shared/components/dropdowns/dropdown/dropdown.component";
import { IValueOption } from "../../../../shared/models/utils/value-option";
import { GeneralUtils } from "../../../../shared/utils/general-utils";
import { CurrencyType } from "../../../../shared/enums/currency-type";
import { ButtonComponent } from "../../../../shared/components/buttons/button/button.component";
import { SearchableDropdownComponent } from "../../../../shared/components/dropdowns/searchable-dropdown/searchable-dropdown.component";
import { ErrorMessageWrapperComponent } from "../../../../shared/components/error-message-wrapper/error-message-wrapper.component";
import { CurrencyService } from "../../../currency/services/currency.service";
import { PlanService } from "../../services/plan.service";
import { ImageService } from "../../../image/services/image.service";
import { switchMap } from "rxjs";
import { ModifyPlanDto } from "../../models/modify-plan-dto";
import { SnackbarService } from "../../../../core/services/snackbar/snackbar.service";
import { ESnackbarType } from "../../../../core/models/utils/others/snackbar-type.enum";
import { Router } from "@angular/router";

@Component({
	selector: "app-create-a-plan-popup",
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
	templateUrl: "./create-a-plan-popup.component.html",
	styleUrl: "./create-a-plan-popup.component.css",
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateAPlanPopupComponent extends BaseFormComponent {
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
		private router: Router,
		private utilsService: UtilsService,
		private snackbarService: SnackbarService,
		private planService: PlanService,
		private imageService: ImageService,
		private currencyService: CurrencyService,
		private ref: MatDialogRef<CreateAPlanPopupComponent>
	) {
		super();

		this.setFormGroup(
			fb.group({
				planName: fb.control<string>("", [
					Validators.required,
					Validators.minLength(5),
				]),
				planDescription: fb.control<string>(""),
				destination: fb.control<string>("", [Validators.required]),
				photo: fb.control<File | null>(null, [Validators.required]),
				dateRange: this.fb.control<{
					start: Date | null;
					end: Date | null;
				} | null>(null, [
					Validators.required,
					DateValidators.validateDateRange,
				]),
				currencyType: fb.control<IValueOption | null>(null, [
					Validators.required,
				]),
				isPublic: fb.control<boolean>(false),
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

	protected createPlan(): void {
		this.submit();

		if (this.formGroup.valid) {
			this.imageService
				.upload(this.photoControl.value!)
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

						return this.planService.createPlan(body);
					})
				)
				.subscribe({
					next: (x) => {
						this.ref.close();
						this.snackbarService.openSnackBar(
							"Plan created successfully.",
							ESnackbarType.INFO
						);
						this.router.navigateByUrl(`/view-plan/${x.data.id}`);
					},
				});
		}
	}
}
