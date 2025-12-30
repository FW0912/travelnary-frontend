import { ChangeDetectionStrategy, Component } from "@angular/core";
import { BasePopupComponent } from "../base-popup/base-popup.component";
import {
	MatDialogActions,
	MatDialogContent,
	MatDialogRef,
} from "@angular/material/dialog";
import { BorderButtonComponent } from "../../shared/components/buttons/border-button/border-button.component";
import { ButtonComponent } from "../../shared/components/buttons/button/button.component";

@Component({
	selector: "app-confirmation-popup",
	imports: [
		BasePopupComponent,
		MatDialogContent,
		MatDialogActions,
		BorderButtonComponent,
		ButtonComponent,
	],
	templateUrl: "./confirmation-popup.component.html",
	styleUrl: "./confirmation-popup.component.css",
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfirmationPopupComponent {
	constructor(private ref: MatDialogRef<ConfirmationPopupComponent>) {}

	public close(isConfirmed: boolean): void {
		this.ref.close(isConfirmed);
	}
}
