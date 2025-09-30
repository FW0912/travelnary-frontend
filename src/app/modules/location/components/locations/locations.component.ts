import {
	ChangeDetectionStrategy,
	Component,
	input,
	signal,
} from "@angular/core";
import { LocationDetailsCardComponent } from "./components/location-details-card/location-details-card.component";
import { CdkDrag, CdkDropList } from "@angular/cdk/drag-drop";
import { Location } from "../../../../core/models/domain/location/location";
import { LocationDetailsSectionComponent } from "./components/location-details-section/location-details-section.component";

@Component({
	selector: "app-locations",
	imports: [
		LocationDetailsCardComponent,
		CdkDropList,
		CdkDrag,
		LocationDetailsSectionComponent,
	],
	templateUrl: "./locations.component.html",
	styleUrl: "./locations.component.css",
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LocationsComponent {
	public day = input.required<number>();
	public locationList = input.required<Array<Location>>();
	public readOnly = input.required<boolean>();
	public isSorting = signal<boolean>(false);
}
