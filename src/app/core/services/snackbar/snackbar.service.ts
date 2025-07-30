import { Injectable } from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar";
import { ESnackbarType } from "../../models/utils/snackbar-type-enum";
import { ThemeService } from "../theme/theme.service";
import { ETheme } from "../../models/utils/theme-enum";

@Injectable({
	providedIn: "root",
})
export class SnackbarService {
	constructor(
		private snackBar: MatSnackBar,
		private themeService: ThemeService
	) {}

	public openSnackBar(
		message: string,
		type: ESnackbarType,
		duration: number = 2000,
		action?: string
	) {
		switch (type) {
			default:
			case ESnackbarType.INFO:
				this.snackBar.open(message, action, {
					duration: duration,
					panelClass:
						this.themeService.theme.getValue() === ETheme.LIGHT
							? "info-snackbar"
							: "dark-info-snackbar",
				});
				break;
			case ESnackbarType.ERROR:
				this.snackBar.open(message, action, {
					duration: duration,
					verticalPosition: "top",
					panelClass: "error-snackbar",
				});
				break;
		}
	}
}
