import { Component, Inject, signal } from "@angular/core";
import { ButtonComponent } from "../../../../shared/components/buttons/button/button.component";
import {
	MatDialogContent,
	MatDialogActions,
	MatDialogRef,
	MAT_DIALOG_DATA,
} from "@angular/material/dialog";
import { BasePopupComponent } from "../../../base-popup/base-popup.component";
import { SafeUrlPipe } from "../../../../shared/pipes/safe-url/safe-url.pipe";
import { SnackbarService } from "../../../../core/services/snackbar/snackbar.service";
import { LocationService } from "../../services/location.service";
import { ESnackbarType } from "../../../../core/models/utils/others/snackbar-type.enum";
import { timer } from "rxjs";

@Component({
	selector: "app-location-map-popup",
	imports: [
		BasePopupComponent,
		MatDialogContent,
		MatDialogActions,
		ButtonComponent,
		SafeUrlPipe,
	],
	templateUrl: "./location-map-popup.component.html",
	styleUrl: "./location-map-popup.component.css",
})
export class LocationMapPopupComponent {
	protected mapsUrl = signal<string | null>(null);

	constructor(
		private ref: MatDialogRef<LocationMapPopupComponent>,
		@Inject(MAT_DIALOG_DATA)
		private data: {
			url: string;
		},
		private snackbarService: SnackbarService
	) {
		if (!data || !data.url) {
			snackbarService.openSnackBar(
				"Can't get data!",
				ESnackbarType.ERROR
			);
			ref.close();
			return;
		}

		this.mapsUrl.set(data.url);
	}

	protected retryMap(): void {
		const url = this.mapsUrl();
		this.mapsUrl.set(null);
		timer(0).subscribe(() => this.mapsUrl.set(url));
	}

	protected close(): void {
		this.ref.close();
	}
}
