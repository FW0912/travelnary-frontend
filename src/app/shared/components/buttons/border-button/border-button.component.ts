import { ChangeDetectionStrategy, Component } from "@angular/core";
import { BaseButtonComponent } from "../base-button/base-button.component";

@Component({
	selector: "app-border-button",
	imports: [],
	templateUrl: "./../base-button/base-button.component.html",
	styleUrl: "./../base-button/base-button.component.css",
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BorderButtonComponent extends BaseButtonComponent {
	protected override specificClasses: string =
		"border border-black hover:bg-hover-bg dark:border-white dark:hover:bg-dark-hover-bg";
}
