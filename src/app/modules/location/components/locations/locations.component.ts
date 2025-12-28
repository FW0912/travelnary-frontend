import {
	ChangeDetectionStrategy,
	Component,
	DestroyRef,
	effect,
	input,
	output,
	signal,
} from "@angular/core";
import { LocationDetailsCardComponent } from "./components/location-details-card/location-details-card.component";
import {
	CdkDrag,
	CdkDragDrop,
	CdkDragHandle,
	CdkDropList,
	moveItemInArray,
} from "@angular/cdk/drag-drop";
import { Location } from "../../../../core/models/domain/location/location";
import { LocationDetailsSectionComponent } from "./components/location-details-section/location-details-section.component";
import { MatDialog } from "@angular/material/dialog";
import { AddLocationPopupComponent } from "../../popups/add-location-popup/add-location-popup.component";
import { BorderButtonComponent } from "../../../../shared/components/buttons/border-button/border-button.component";
import { ButtonComponent } from "../../../../shared/components/buttons/button/button.component";
import { GetLocationDto } from "../../models/get-location-dto";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";

@Component({
	selector: "app-locations",
	imports: [
		LocationDetailsCardComponent,
		CdkDropList,
		CdkDrag,
		LocationDetailsSectionComponent,
		BorderButtonComponent,
		ButtonComponent,
		CdkDragHandle,
	],
	templateUrl: "./locations.component.html",
	styleUrl: "./locations.component.css",
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LocationsComponent {
	public planId = input.required<string>();
	public destination = input.required<string | null>();
	public day = input.required<number>();
	public currencyName = input<string>("");
	public locationList = input.required<Array<GetLocationDto>>();
	public readOnly = input.required<boolean>();
	public simple = input<boolean>(false);
	public editorToken = input<string | null>(null);
	public isSorting = signal<boolean>(false);

	public sortedLocationList = signal<Array<GetLocationDto>>(new Array());

	public onAdd = output<void>();
	public onEdit = output<void>();
	public onSort = output<{
		day: number;
		locationList: Array<GetLocationDto>;
	}>();
	public onDelete = output<{
		day: number;
		id: string;
	}>();

	constructor(private dialog: MatDialog, private destroyRef: DestroyRef) {}

	protected enableSorting(): void {
		this.sortedLocationList.set(this.locationList());
		this.isSorting.set(true);
	}

	protected saveSortedList(): void {
		this.onSort.emit({
			day: this.day(),
			locationList: this.sortedLocationList(),
		});
		this.isSorting.set(false);
	}

	protected cancelSorting(): void {
		this.isSorting.set(false);
	}

	protected onCardDrop(event: CdkDragDrop<Array<Location>>): void {
		const clone = [...this.sortedLocationList()];
		moveItemInArray(clone, event.previousIndex, event.currentIndex);
		clone.forEach((x, i) => {
			x.sortOrder = i + 1;
		});
		this.sortedLocationList.set(clone);
	}

	protected onAddLocation(): void {
		const dialogRef = this.dialog.open(AddLocationPopupComponent, {
			maxWidth: "50vw",
			data: {
				planId: this.planId(),
				destination: this.destination(),
				day: this.day(),
				lastSortOrder:
					this.locationList().length > 0
						? this.locationList().reduce((x, y) =>
								x.sortOrder > y.sortOrder ? x : y
						  ).sortOrder
						: 0,
				currencyName: this.currencyName(),
				editorToken: this.editorToken(),
			},
		});

		dialogRef
			.afterClosed()
			.pipe(takeUntilDestroyed(this.destroyRef))
			.subscribe({
				next: (x) => {
					if (x) {
						this.onAdd.emit();
					}
				},
			});
	}

	protected onEditLocation(): void {
		this.onEdit.emit();
	}

	protected onDeleteLocation(event: { day: number; id: string }): void {
		this.onDelete.emit(event);
	}
}
