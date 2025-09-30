import {
	ChangeDetectionStrategy,
	Component,
	computed,
	effect,
	ElementRef,
	input,
	signal,
} from "@angular/core";
import { BaseDropdownComponent } from "../base-dropdown/base-dropdown.component";
import { CommonModule } from "@angular/common";
import { IValueOption } from "../../../models/utils/value-option";
import { FormsModule } from "@angular/forms";
import { EventService } from "../../../../core/services/event/event.service";

@Component({
	selector: "app-searchable-dropdown",
	imports: [CommonModule, FormsModule],
	templateUrl: "./searchable-dropdown.component.html",
	styleUrl: "./searchable-dropdown.component.css",
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchableDropdownComponent extends BaseDropdownComponent {
	public id = input.required<string>();
	protected input = signal<string>("");
	protected filteredOptionList = computed(() => {
		const optionList = this.optionList();
		const input = this.input().toLowerCase();
		const selectedOption = this.selectedOption();

		if (selectedOption && input === selectedOption.value.toLowerCase()) {
			return new Array();
		}

		if (optionList.length > 0 && input.length > 0) {
			return optionList.filter((x) =>
				x.value.toLowerCase().includes(input)
			);
		}

		return optionList;
	});

	constructor(private x: EventService, private y: ElementRef) {
		super(x, y);

		effect(() => {
			const initialOption = this.initialOption();

			if (initialOption) {
				this.input.set(initialOption.value);
			}
		});

		effect(() => {
			const input = this.input();
			const selectedOption = this.selectedOption();

			if (selectedOption && input !== selectedOption.value) {
				this.selectedOption.set(null);
				this.onSelected.emit(null);
			}
		});
	}

	protected override onOptionSelected(option: IValueOption): void {
		this.input.set(option.value);
		this.selectedOption.set(option);
		this.onSelected.emit(option);
		this.isDropdownOpen.set(false);
	}

	protected onFocus() {
		this.isDropdownOpen.set(true);
	}
}
