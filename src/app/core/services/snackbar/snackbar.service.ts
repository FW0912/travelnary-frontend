import { Inject, Injectable, NgZone, PLATFORM_ID } from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar";
import { ESnackbarType } from "../../models/utils/others/snackbar-type.enum";
import { ThemeService } from "../theme/theme.service";
import { ETheme } from "../../models/utils/others/theme.enum";
import { isPlatformBrowser } from "@angular/common";

@Injectable({
	providedIn: "root",
})
export class SnackbarService {
	constructor(
		private snackBar: MatSnackBar,
		private themeService: ThemeService,
		private zone: NgZone,
		@Inject(PLATFORM_ID) private platformId: Object
	) {}

	public openSnackBar(
		message: string,
		type: ESnackbarType,
		duration: number = 2000,
		action?: string
	) {
		if (isPlatformBrowser(this.platformId)) {
			switch (type) {
				default:
				case ESnackbarType.INFO:
					this.zone.run(() => {
						this.snackBar.open(message, action, {
							duration: duration,
							horizontalPosition: "center",
							verticalPosition: "bottom",
							panelClass:
								this.themeService.theme() === ETheme.LIGHT
									? "info-snackbar"
									: "dark-info-snackbar",
						});
					});
					break;
				case ESnackbarType.ERROR:
					this.zone.run(() => {
						this.snackBar.open(message, action, {
							duration: duration,
							horizontalPosition: "center",
							verticalPosition: "bottom",
							panelClass: "error-snackbar",
						});
					});
					break;
			}
		}
	}
}
