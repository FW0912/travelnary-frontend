import {
	ChangeDetectionStrategy,
	Component,
	DestroyRef,
	forwardRef,
	inject,
	Injector,
	Self,
	signal,
} from "@angular/core";
import { BaseSharedComponent } from "../../base-shared/base-shared.component";
import {
	AbstractControl,
	ControlValueAccessor,
	FormControl,
	FormGroup,
	NG_VALUE_ACCESSOR,
	NgControl,
} from "@angular/forms";
import { SubmitFormGroup } from "../../../../core/models/utils/others/submit-form-group";
import { filter, take, takeUntil } from "rxjs";
import { takeUntilDestroyed, toObservable } from "@angular/core/rxjs-interop";

@Component({
	selector: "app-base-input",
	imports: [],
	template: "",
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export abstract class BaseInputComponent<T>
	extends BaseSharedComponent
	implements ControlValueAccessor
{
	protected onChange: Function = (value: any) => {};
	protected onTouched: Function = () => {};
	protected ngControl!: NgControl;
	protected isFormSubmitted = signal<boolean>(false);
	private injector: Injector = inject(Injector);
	protected destroyRef: DestroyRef = inject(DestroyRef);

	constructor() {
		super();
	}

	ngOnInit() {
		this.ngControl = this.injector.get(NgControl);
	}

	ngAfterViewInit() {
		var rootGroup: SubmitFormGroup;

		if (!this.ngControl.control) {
			throw new Error("FormControl not found!");
		}

		if (this.ngControl.control!.root instanceof SubmitFormGroup) {
			rootGroup = this.ngControl.control!.root;
		} else {
			return;
		}

		rootGroup!.controls.isFormSubmitted.valueChanges
			.pipe(take(1), takeUntilDestroyed(this.destroyRef))
			.subscribe((x) => this.isFormSubmitted.set(x!));
	}

	abstract writeValue(obj: T): void;
	registerOnChange(fn: Function): void {
		this.onChange = fn;
	}
	registerOnTouched(fn: Function): void {
		this.onTouched = fn;
	}
	abstract setDisabledState(isDisabled: boolean): void;
}
