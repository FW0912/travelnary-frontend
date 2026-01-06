import {
	ChangeDetectionStrategy,
	Component,
	DestroyRef,
	effect,
	ElementRef,
	Inject,
	input,
	output,
	PLATFORM_ID,
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
import { ButtonComponent } from "../../../../../../shared/components/buttons/button/button.component";
import { BreakpointObserver, Breakpoints } from "@angular/cdk/layout";
import { isPlatformBrowser } from "@angular/common";
import { LocationMapPopupComponent } from "../../../../popups/location-map-popup/location-map-popup.component";

@Component({
	selector: "app-location-details-section",
	imports: [
		LocationDetailsComponent,
		BorderButtonComponent,
		DefaultImageComponent,
		ButtonComponent,
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
	public showedLocationIdOnMap = input<string | null>(null);
	public editorToken = input<string | null>(null);

	protected isDropdownOpen = signal<boolean>(false);
	protected shouldOpenMapPopup = signal<boolean>(false);
	protected isCurrentLocationBeingShownOnMap = signal<boolean>(false);

	public showLocationMap = output<GetLocationDto | null>();
	public onEdit = output<void>();
	public onDelete = output<{
		day: number;
		id: string;
	}>();

	constructor(
		private eventService: EventService,
		private breakpointObserver: BreakpointObserver,
		private dialog: MatDialog,
		private destroyRef: DestroyRef,
		private locationService: LocationService,
		private snackbarService: SnackbarService,
		@Inject(PLATFORM_ID) private platformId: Object
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

		if (isPlatformBrowser(this.platformId)) {
			this.breakpointObserver
				.observe([
					Breakpoints.Medium,
					Breakpoints.Small,
					Breakpoints.XSmall,
				])
				.pipe(takeUntilDestroyed())
				.subscribe((x) => this.shouldOpenMapPopup.set(x.matches));
		}

		effect(() => {
			const showedLocationIdOnMap = this.showedLocationIdOnMap();

			if (this.location()) {
				if (showedLocationIdOnMap === this.location().id) {
					this.isCurrentLocationBeingShownOnMap.set(true);
				} else {
					this.isCurrentLocationBeingShownOnMap.set(false);
				}
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

	protected openMapPopup(): void {
		this.isCurrentLocationBeingShownOnMap.set(true);

		const dialogRef = this.dialog.open(LocationMapPopupComponent, {
			minWidth: "50%",
			maxHeight: "80%",
			data: {
				url: `
					https://www.google.com/maps?q=${this.location().location.latitude},${
					this.location().location.longitude
				}&z=16&output=embed`,
			},
		});

		dialogRef
			.afterClosed()
			.pipe(takeUntilDestroyed(this.destroyRef))
			.subscribe(() => this.isCurrentLocationBeingShownOnMap.set(false));
	}

	protected showOnMap(): void {
		if (this.shouldOpenMapPopup()) {
			this.openMapPopup();
			return;
		}

		this.showLocationMap.emit(this.location());
		this.isCurrentLocationBeingShownOnMap.set(true);
	}

	protected unshowOnMap(): void {
		if (this.shouldOpenMapPopup()) {
			return;
		}

		this.showLocationMap.emit(null);
		this.isCurrentLocationBeingShownOnMap.set(false);
	}
}
