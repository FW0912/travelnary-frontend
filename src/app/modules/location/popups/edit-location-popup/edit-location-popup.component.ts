import {
	ChangeDetectionStrategy,
	Component,
	Inject,
	signal,
} from "@angular/core";
import { BasePopupComponent } from "../../../base-popup/base-popup.component";
import {
	MAT_DIALOG_DATA,
	MatDialogActions,
	MatDialogContent,
	MatDialogModule,
	MatDialogRef,
} from "@angular/material/dialog";
import { Location } from "../../../../core/models/domain/location/location";
import { SnackbarService } from "../../../../core/services/snackbar/snackbar.service";
import { ESnackbarType } from "../../../../core/models/utils/others/snackbar-type.enum";
import { BaseFormComponent } from "../../../base-form-page/base-form-page.component";
import {
	FormBuilder,
	FormControl,
	ReactiveFormsModule,
	Validators,
} from "@angular/forms";
import { IValueOption } from "../../../../shared/models/utils/value-option";
import { DropdownComponent } from "../../../../shared/components/dropdowns/dropdown/dropdown.component";
import { GeneralUtils } from "../../../../shared/utils/general-utils";
import { LocationCategory } from "../../../../shared/enums/location-category";
import { CommonModule, DatePipe, DecimalPipe } from "@angular/common";
import { TextInputComponent } from "../../../../shared/components/inputs/text-input/text-input.component";
import { TextAreaComponent } from "../../../../shared/components/inputs/text-area/text-area.component";
import { TimePickerComponent } from "../../../../shared/components/inputs/time-picker/time-picker.component";
import { ButtonComponent } from "../../../../shared/components/buttons/button/button.component";
import { LocationService } from "../../services/location.service";
import { GetLocationDto } from "../../models/get-location-dto";
import { BorderButtonComponent } from "../../../../shared/components/buttons/border-button/border-button.component";
import { ModifyLocationDto } from "../../models/modify-location-dto";
import { Observable, switchMap } from "rxjs";
import { ApiResponse } from "../../../../core/models/api/api-response";
import { ImageService } from "../../../image/services/image.service";
import { UploadImageDto } from "../../../image/models/upload-image-dto";

@Component({
	selector: "app-edit-location-popup",
	imports: [
		BasePopupComponent,
		MatDialogContent,
		MatDialogActions,
		ReactiveFormsModule,
		DropdownComponent,
		CommonModule,
		TextInputComponent,
		TextAreaComponent,
		TimePickerComponent,
		ButtonComponent,
		BorderButtonComponent,
	],
	providers: [DatePipe],
	templateUrl: "./edit-location-popup.component.html",
	styleUrl: "./edit-location-popup.component.css",
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditLocationPopupComponent extends BaseFormComponent {
	protected location: GetLocationDto | null = null;
	private planId: string | null = null;
	private day: number | null = null;
	private editorToken: string | null = null;
	protected locationCategoryOptionList = signal<Array<IValueOption>>(
		new Array()
	);
	protected photoUrl = signal<string | null>(null);

	constructor(
		private ref: MatDialogRef<EditLocationPopupComponent>,
		@Inject(MAT_DIALOG_DATA)
		private data: {
			location: GetLocationDto;
			planId: string;
			day: number;
			editorToken: string | null;
		},
		private snackbarService: SnackbarService,
		private imageService: ImageService,
		private locationService: LocationService,
		private datePipe: DatePipe,
		private fb: FormBuilder
	) {
		super();

		if (!data || !data.location) {
			snackbarService.openSnackBar(
				"Can't get Location Details!",
				ESnackbarType.ERROR
			);
			ref.close();
			return;
		}

		if (!data.planId) {
			snackbarService.openSnackBar(
				"Can't get Plan Id!",
				ESnackbarType.ERROR
			);
			ref.close();
			return;
		}

		if (!data.day) {
			snackbarService.openSnackBar("Can't get day!", ESnackbarType.ERROR);
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

		this.location = data.location;
		this.planId = data.planId;
		this.day = data.day;
		this.editorToken = data.editorToken;

		if (this.location.photoUrl) {
			this.photoUrl.set(this.location.photoUrl);
		}

		this.setFormGroup(
			fb.group({
				category: fb.control<IValueOption | null>(
					{
						id: this.location.category.id,
						value: this.location.category.name,
					},
					[Validators.required]
				),
				name: fb.control<string>(this.location.name, [
					Validators.required,
					Validators.minLength(5),
				]),
				address: fb.control<string>(this.location.address, [
					Validators.required,
				]),
				photo: fb.control<File | null>(null),
				notes: fb.control<string>(this.location.notes),
				time: fb.control<Date | null>(
					this.location.time ? new Date(this.location.time) : null
				),
				cost: fb.control<number>(this.location.cost),
			})
		);
	}

	protected get categoryControl(): FormControl<IValueOption | null> {
		return this.formGroup.get("category")! as FormControl;
	}

	protected get nameControl(): FormControl<string> {
		return this.formGroup.get("name")! as FormControl;
	}

	protected get addressControl(): FormControl<string> {
		return this.formGroup.get("address")! as FormControl;
	}

	protected get photoControl(): FormControl<File | null> {
		return this.formGroup.get("photo")! as FormControl;
	}

	protected get notesControl(): FormControl<string> {
		return this.formGroup.get("notes")! as FormControl;
	}

	protected get timeControl(): FormControl<Date | null> {
		return this.formGroup.get("time")! as FormControl;
	}

	protected get costControl(): FormControl<number | null> {
		return this.formGroup.get("cost")! as FormControl;
	}

	ngOnInit(): void {
		this.locationService.getAllLocationCategories().subscribe({
			next: (x) => {
				this.locationCategoryOptionList.set(
					x.data.map((y) => {
						return {
							id: y.id,
							value: y.name,
						};
					})
				);
			},
		});
	}

	protected onCategorySelected(category: IValueOption | null) {
		this.formGroup.get("category")!.setValue(category);
	}

	protected onUploadFile(event: Event): void {
		const target = event.target! as HTMLInputElement;

		if (target.files !== null && target.files.item(0) !== null) {
			this.photoControl.setValue(target.files.item(0)!);

			const fileReader: FileReader = new FileReader();

			fileReader.onload = (event) => {
				this.photoUrl.set(event.target!.result as string);
			};

			fileReader.readAsDataURL(target.files.item(0)!);
		} else {
			this.photoControl.setValue(null);
			this.photoUrl.set(null);
		}
	}

	private getUpdateLocationObservable(
		body: ModifyLocationDto
	): Observable<ApiResponse<any>> {
		if (this.editorToken) {
			return this.locationService.updateSharedLocation(
				body,
				this.editorToken
			);
		} else {
			return this.locationService.updateLocation(body);
		}
	}

	private getUploadImageObservable(): Observable<
		ApiResponse<UploadImageDto>
	> {
		if (this.editorToken) {
			return this.imageService.uploadShared(
				this.planId!,
				this.photoControl.value!,
				this.editorToken
			);
		} else {
			return this.imageService.upload(this.photoControl.value!);
		}
	}

	protected editLocation(): void {
		this.submit();

		if (this.formGroup.valid) {
			var observable: Observable<ApiResponse<any>>;

			if (this.photoControl.value !== null) {
				observable = this.getUploadImageObservable().pipe(
					switchMap((x) => {
						const body: ModifyLocationDto = {
							id: this.location!.id,
							planId: this.planId!,
							day: this.day!,
							category: this.categoryControl.value!.value,
							name: this.nameControl.value,
							address: this.addressControl.value,
							photoUrl: x.data.fileUrl,
							notes: this.notesControl.value,
							location: this.location!.location,
							time: this.timeControl.value
								? this.datePipe.transform(
										this.timeControl.value,
										"HH:mm"
								  )
								: null,
							currencyName: this.location!.currencyName,
							cost: this.costControl.value,
							sortOrder: this.location!.sortOrder,
						};

						return this.getUpdateLocationObservable(body);
					})
				);
			} else {
				const body: ModifyLocationDto = {
					id: this.location!.id,
					planId: this.planId!,
					day: this.day!,
					category: this.categoryControl.value!.value,
					name: this.nameControl.value,
					address: this.addressControl.value,
					photoUrl: this.location!.photoUrl,
					notes: this.notesControl.value,
					location: this.location!.location,
					time: this.timeControl.value
						? this.datePipe.transform(
								this.timeControl.value,
								"HH:mm"
						  )
						: null,
					currencyName: this.location!.currencyName,
					cost: this.costControl.value,
					sortOrder: this.location!.sortOrder,
				};

				observable = this.getUpdateLocationObservable(body);
			}

			observable.subscribe({
				next: () => {
					this.snackbarService.openSnackBar(
						"Location edited succesfully.",
						ESnackbarType.INFO
					);
					this.ref.close(true);
				},
			});
		}
	}
}
