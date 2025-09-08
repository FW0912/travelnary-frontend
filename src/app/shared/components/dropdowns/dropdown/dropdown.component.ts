import {
	ChangeDetectionStrategy,
	Component,
	effect,
	input,
	Input,
	output,
	signal,
} from "@angular/core";
import { IValueOption } from "../../../models/utils/value-option";
import { CommonModule } from "@angular/common";
import { BaseDropdownComponent } from "../base-dropdown/base-dropdown.component";

@Component({
	selector: "app-dropdown",
	imports: [CommonModule],
	templateUrl: "./dropdown.component.html",
	styleUrl: "./dropdown.component.css",
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DropdownComponent extends BaseDropdownComponent {}
