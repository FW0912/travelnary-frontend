import { Component, Input, output } from "@angular/core";
import { IValueOption } from "../../models/utils/value-option";
import { CommonModule } from "@angular/common";

@Component({
	selector: "app-dropdown",
	imports: [CommonModule],
	templateUrl: "./dropdown.component.html",
	styleUrl: "./dropdown.component.css",
})
export class DropdownComponent {
	@Input({ required: true }) public optionList!: Array<IValueOption>;
	@Input({ required: true }) public widthClass!: string;
	@Input({ required: false }) public initialOption: IValueOption | null =
		null;
	@Input({ required: false }) public extraClasses: string = "";
	protected selectedOption: IValueOption | null = null;
	protected isDropdownOpen: boolean = false;
	public onSelected = output<IValueOption>();

	ngOnChanges() {
		if (this.initialOption != null && this.selectedOption === null) {
			this.selectedOption = this.initialOption;
		}
	}

	protected toggleDropdown() {
		this.isDropdownOpen = !this.isDropdownOpen;
	}

	protected onOptionSelected(option: IValueOption) {
		this.selectedOption = option;
		this.onSelected.emit(option);
		this.isDropdownOpen = false;
	}
}
