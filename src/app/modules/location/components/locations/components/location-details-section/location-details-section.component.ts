import {
	ChangeDetectionStrategy,
	Component,
	DestroyRef,
	effect,
	ElementRef,
	input,
	output,
	signal,
	ViewChild,
} from "@angular/core";
import { LocationDetailsComponent } from "../location-details/location-details.component";
import { Location } from "../../../../../../core/models/domain/location/location";
import { BorderButtonComponent } from "../../../../../../shared/components/buttons/border-button/border-button.component";
import { EventService } from "../../../../../../core/services/event/event.service";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { EventName } from "../../../../../../shared/enums/event-name";
import { MatDialog } from "@angular/material/dialog";
import { LocationDetailsPopupComponent } from "../../../../popups/location-details-popup/location-details-popup.component";
import { EditLocationPopupComponent } from "../../../../popups/edit-location-popup/edit-location-popup.component";
import { ConfirmationPopupComponent } from "../../../../../confirmation-popup/confirmation-popup.component";
import { GetLocationDto } from "../../../../models/get-location-dto";
import { LocationService } from "../../../../services/location.service";
import { SnackbarService } from "../../../../../../core/services/snackbar/snackbar.service";
import { ESnackbarType } from "../../../../../../core/models/utils/others/snackbar-type.enum";
import { DefaultImageComponent } from "../../../../../../shared/components/images/default-image/default-image.component";

@Component({
	selector: "app-location-details-section",
	imports: [
		LocationDetailsComponent,
		BorderButtonComponent,
		DefaultImageComponent,
	],
	templateUrl: "./location-details-section.component.html",
	styleUrl: "./location-details-section.component.css",
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LocationDetailsSectionComponent {
	@ViewChild("options") private options!: ElementRef;

	public planId = input.required<string>();
	public day = input.required<number>();
	public location = input.required<GetLocationDto>();
	public readOnly = input.required<boolean>();
	public simple = input<boolean>(false);
	public isLast = input<boolean>(false);
	public editorToken = input<string | null>(null);

	protected isDropdownOpen = signal<boolean>(false);

	public onEdit = output<void>();
	public onDelete = output<{
		day: number;
		id: string;
	}>();

	constructor(
		private eventService: EventService,
		private dialog: MatDialog,
		private destroyRef: DestroyRef,
		private locationService: LocationService,
		private snackbarService: SnackbarService
	) {
		eventService
			.listen<MouseEvent>(EventName.DOCUMENT_CLICK)
			.pipe(takeUntilDestroyed())
			.subscribe((x) => {
				if (
					this.options &&
					this.isDropdownOpen() &&
					!(this.options.nativeElement as HTMLElement).contains(
						x.target! as HTMLElement
					)
				) {
					this.isDropdownOpen.set(false);
				}
			});
	}

	protected toggleOptionsDropdown(): void {
		this.isDropdownOpen.update((x) => !x);
	}

	protected openDetailsPopup(): void {
		this.isDropdownOpen.set(false);
		this.dialog.open(LocationDetailsPopupComponent, {
			width: "35%",
			maxHeight: "80%",
			data: {
				location: this.location(),
			},
		});
	}

	protected openEditDetailsPopup(): void {
		this.isDropdownOpen.set(false);
		const dialogRef = this.dialog.open(EditLocationPopupComponent, {
			minWidth: "35%",
			maxWidth: "50vw",
			maxHeight: "80%",
			data: {
				location: this.location(),
				planId: this.planId(),
				day: this.day(),
				editorToken: this.editorToken(),
			},
		});

		dialogRef
			.afterClosed()
			.pipe(takeUntilDestroyed(this.destroyRef))
			.subscribe((x) => {
				if (x) {
					this.onEdit.emit();
				}
			});
	}

	protected openRemovePopup(): void {
		this.isDropdownOpen.set(false);
		const ref = this.dialog.open(ConfirmationPopupComponent, {
			minWidth: "35%",
		});

		ref.afterClosed().subscribe((x) => {
			if (x) {
				this.locationService
					.deleteLocation(this.location().id)
					.subscribe({
						next: () => {
							this.snackbarService.openSnackBar(
								"Plan deleted successfully.",
								ESnackbarType.INFO
							);
							this.onDelete.emit({
								day: this.day(),
								id: this.location().id,
							});
						},
					});
			}
		});
	}
}
