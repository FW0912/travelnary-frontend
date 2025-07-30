import { CommonModule } from "@angular/common";
import { Component, Input, model } from "@angular/core";
import { FormsModule } from "@angular/forms";

@Component({
	selector: "app-text-input",
	imports: [CommonModule, FormsModule],
	templateUrl: "./text-input.component.html",
	styleUrl: "./text-input.component.css",
})
export class TextInputComponent {
	public input = model<string>("");
	@Input({ required: true }) public id: string = "";
	@Input({ required: true }) public name: string = "";
	@Input({ required: true }) public placeholder: string = "";
	@Input({ required: false }) public type: "text" | "password" | "email" =
		"text";
	@Input({ required: false }) public isHidden: boolean = false;
	@Input({ required: false }) public extraClasses: string = "";
}
