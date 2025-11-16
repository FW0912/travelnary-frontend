import {
	ChangeDetectionStrategy,
	Component,
	effect,
	forwardRef,
	signal,
} from "@angular/core";
import { TextInputComponent } from "../text-input/text-input.component";
import { Subject, BehaviorSubject, debounceTime, filter } from "rxjs";
import { IValueOption } from "../../../models/utils/value-option";
import { UtilsService } from "../../../../core/services/utils/utils.service";
import { BaseInputComponent } from "../base-input/base-input.component";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import {
	FormControl,
	NG_VALUE_ACCESSOR,
	ReactiveFormsModule,
} from "@angular/forms";

@Component({
	selector: "app-destination-search",
	imports: [TextInputComponent, ReactiveFormsModule],
	templateUrl: "./destination-search.component.html",
	styleUrl: "./destination-search.component.css",
	changeDetection: ChangeDetectionStrategy.OnPush,
	providers: [
		{
			provide: NG_VALUE_ACCESSOR,
			useExisting: forwardRef(() => DestinationSearchComponent),
			multi: true,
		},
	],
})
export class DestinationSearchComponent extends BaseInputComponent<string> {
	private destinationFilterSubject: Subject<string> = new Subject<string>();
	protected destinationOptionList: Array<IValueOption> = new Array();
	protected filteredDestinationOptionList = new BehaviorSubject(new Array());

	private value = signal<string>("");
	private isDisabled = signal<boolean>(false);

	constructor(private utilsService: UtilsService) {
		super();

		this.destinationFilterSubject
			.pipe(takeUntilDestroyed(), debounceTime(300))
			.subscribe(() => this.filterDestinationAutocomplete());

		this.utilsService
			.readJsonAsset("/assets/countries.min.json")
			.pipe(takeUntilDestroyed())
			.subscribe((data) => {
				const concatCountryAndCity: Array<{
					id: string;
					value: string;
				}> = Array.from(
					new Set<string>(
						Object.keys(data)
							.map((x) =>
								new Array(x).concat(
									data[x].map((y: string) =>
										x.concat(", ", y)
									)
								)
							)
							.reduce((a: Array<string>, b: Array<string>) =>
								a.concat(b)
							)
					)
				).map((x, i) => {
					return {
						id: (i + 1).toString(),
						value: x,
					};
				});

				this.destinationOptionList = concatCountryAndCity;
				this.filteredDestinationOptionList.next(
					concatCountryAndCity.slice(0, 20)
				);
			});
	}

	ngAfterContentInit() {
		this.ngControl
			.control!.valueChanges.pipe(
				filter((x) => x !== this.value()),
				takeUntilDestroyed(this.destroyRef)
			)
			.subscribe((x: string) => {
				this.onDestinationFilterChanged(x);
				this.value.set(x);
				this.onChange(x);
			});
	}

	ngOnDestroy(): void {
		this.destinationFilterSubject.complete();
		this.destinationOptionList = new Array();
		this.filteredDestinationOptionList.complete();
	}

	override writeValue(obj: string): void {
		this.value.set(obj);
	}

	override setDisabledState(isDisabled: boolean): void {
		this.isDisabled.set(isDisabled);
	}

	protected get formControl() {
		return this.ngControl.control as FormControl;
	}

	protected onDestinationFilterChanged(value: string): void {
		this.destinationFilterSubject.next(value);
	}

	protected filterDestinationAutocomplete(): void {
		this.filteredDestinationOptionList.next(
			this.destinationOptionList
				.filter((x) =>
					x.value.toLowerCase().includes(this.value().toLowerCase())
				)
				.slice(0, 20)
		);
	}
}
