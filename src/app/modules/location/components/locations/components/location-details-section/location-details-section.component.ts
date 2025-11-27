import {
	ChangeDetectionStrategy,
	Component,
	ElementRef,
	input,
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

@Component({
	selector: "app-location-details-section",
	imports: [LocationDetailsComponent, BorderButtonComponent],
	templateUrl: "./location-details-section.component.html",
	styleUrl: "./location-details-section.component.css",
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LocationDetailsSectionComponent {
	@ViewChild("options") private options!: ElementRef;

	public location = input.required<GetLocationDto>();
	public readOnly = input.required<boolean>();
	public simple = input<boolean>(false);
	public isLast = input<boolean>(false);
	protected isDropdownOpen = signal<boolean>(false);

	constructor(private eventService: EventService, private dialog: MatDialog) {
		eventService
			.listen<MouseEvent>(EventName.DOCUMENT_CLICK)
			.pipe(takeUntilDestroyed())
			.subscribe((x) => {
				if (
					this.options &&
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
		this.dialog.open(EditLocationPopupComponent, {
			width: "35%",
			maxHeight: "80%",
			data: {
				location: this.location(),
			},
		});
	}

	protected openRemovePopup(): void {
		this.isDropdownOpen.set(false);
		const ref = this.dialog.open(ConfirmationPopupComponent, {
			minWidth: "35%",
		});

		ref.afterClosed().subscribe((x) => console.log(x));
	}
}
