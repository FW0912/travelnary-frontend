import {
	ChangeDetectionStrategy,
	Component,
	forwardRef,
	inject,
	Injector,
	Self,
} from "@angular/core";
import { BaseSharedComponent } from "../../base-shared/base-shared.component";
import {
	ControlValueAccessor,
	FormControl,
	NG_VALUE_ACCESSOR,
	NgControl,
} from "@angular/forms";

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
	protected onChange: Function = () => {};
	protected onTouched: Function = () => {};
	protected ngControl?: NgControl;
	private injector: Injector = inject(Injector);

	constructor() {
		super();
	}

	ngOnInit() {
		this.ngControl = this.injector.get(NgControl);
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
