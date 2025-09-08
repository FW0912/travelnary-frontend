import { ChangeDetectionStrategy, Component } from "@angular/core";
import { BaseButtonComponent } from "../base-button/base-button.component";

@Component({
	selector: "app-button",
	imports: [],
	templateUrl: "./../base-button/base-button.component.html",
	styleUrl: "./../base-button/base-button.component.css",
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ButtonComponent extends BaseButtonComponent {
	protected override specificClasses: string =
		"text-white bg-primary hover:bg-primary-hover";
}
