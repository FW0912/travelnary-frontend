import { AsyncPipe, CommonModule } from "@angular/common";
import { Component, Input, model } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { Observable } from "rxjs";
import { IValueOption } from "../../../models/utils/value-option";

@Component({
	selector: "app-text-input",
	imports: [CommonModule, FormsModule, MatAutocompleteModule, AsyncPipe],
	templateUrl: "./text-input.component.html",
	styleUrl: "./text-input.component.css",
})
export class TextInputComponent {
	public input = model.required<string>();
	@Input({ required: true }) public id!: string;
	@Input({ required: true }) public name!: string;
	@Input({ required: true }) public placeholder!: string;
	@Input({ required: false }) public type:
		| "text"
		| "password"
		| "email"
		| "number" = "text";
	@Input({ required: false }) public isHidden: boolean = false;
	@Input({ required: false }) public extraClasses: string = "";
	@Input({ required: false }) public autoCompleteOptionList: Observable<
		Array<IValueOption>
	> | null = null;
}
