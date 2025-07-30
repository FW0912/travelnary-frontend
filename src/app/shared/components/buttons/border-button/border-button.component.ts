import { Component, Input, output } from "@angular/core";
import { Router } from "@angular/router";

@Component({
	selector: "app-border-button",
	imports: [],
	templateUrl: "./border-button.component.html",
	styleUrl: "./border-button.component.css",
})
export class BorderButtonComponent {
	@Input({ required: true }) public label: string = "";
	@Input({ required: false }) public href: string = "";
	@Input({ required: false }) public extraClasses: string = "";
	public onClick = output<Event>();

	protected onButtonClick(event: Event): void {
		this.onClick.emit(event);
	}
}
