import {
	ChangeDetectionStrategy,
	Component,
	input,
	ViewEncapsulation,
} from "@angular/core";
import { MatDialogModule } from "@angular/material/dialog";

@Component({
	selector: "app-base-popup",
	imports: [MatDialogModule],
	templateUrl: "./base-popup.component.html",
	styleUrl: "./base-popup.component.css",
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: { class: "h-full" },
	encapsulation: ViewEncapsulation.None,
})
export class BasePopupComponent {
	public title = input.required<string>();
}
