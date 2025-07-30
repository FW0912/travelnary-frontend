import { Component, Input, output } from "@angular/core";

@Component({
	selector: "app-button",
	imports: [],
	templateUrl: "./button.component.html",
	styleUrl: "./button.component.css",
})
export class ButtonComponent {
	@Input({ required: true }) public label: string = "";
	@Input({ required: false }) public href: string = "";
	@Input({ required: false }) public extraClasses: string = "";
	public onClick = output<Event>();

	protected onButtonClick(event: Event): void {
		this.onClick.emit(event);
	}
}
