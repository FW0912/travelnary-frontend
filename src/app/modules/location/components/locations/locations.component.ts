import {
	ChangeDetectionStrategy,
	Component,
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
	public day = input.required<number>();
	public currencyName = input<string>("");
	public locationList = input.required<Array<GetLocationDto>>();
	public readOnly = input.required<boolean>();
	public simple = input<boolean>(false);
	public isSorting = signal<boolean>(false);

	public sortedLocationList = signal<Array<GetLocationDto>>(new Array());

	public onSort = output<{
		day: number;
		locationList: Array<GetLocationDto>;
	}>();
	public onDelete = output<{
		day: number;
		id: string;
	}>();

	constructor(private dialog: MatDialog) {}

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

	protected onCardDrop(event: CdkDragDrop<Array<Location>>): void {
		const clone = [...this.sortedLocationList()];
		moveItemInArray(clone, event.previousIndex, event.currentIndex);
		this.sortedLocationList.set(clone);
	}

	protected onAddLocation(): void {
		this.dialog.open(AddLocationPopupComponent, {
			minWidth: "fit-content",
			width: "40vw",
			maxWidth: "70vw",
			height: "90vh",
			data: {
				planId: this.planId(),
				day: this.day(),
				currencyName: this.currencyName(),
			},
		});
	}

	protected onDeleteLocation(event: { day: number; id: string }): void {
		this.onDelete.emit(event);
	}
}
