import {
	ChangeDetectionStrategy,
	Component,
	effect,
	input,
	output,
	signal,
} from "@angular/core";
import { BaseSharedComponent } from "../../base-shared/base-shared.component";
import { IValueOption } from "../../../models/utils/value-option";

@Component({
	selector: "app-base-dropdown",
	imports: [],
	template: "",
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export abstract class BaseDropdownComponent extends BaseSharedComponent {
	public optionList = input.required<Array<IValueOption>>();
	public widthClass = input.required<string>();
	public initialOption = input<IValueOption | null>(null);
	protected selectedOption = signal<IValueOption | null>(null, {
		equal: (a, b) => a?.id === b?.id && a?.value === b?.value,
	});
	protected isDropdownOpen = signal<boolean>(false);
	public onSelected = output<IValueOption>();

	constructor() {
		super();

		effect(() => {
			const initialOption = this.initialOption();

			if (initialOption != null) {
				this.selectedOption.set(initialOption);
			}
		});
	}

	protected toggleDropdown() {
		this.isDropdownOpen.update((state) => !state);
	}

	protected onOptionSelected(option: IValueOption) {
		this.selectedOption.set(option);
		this.onSelected.emit(option);
		this.isDropdownOpen.set(false);
	}
}
