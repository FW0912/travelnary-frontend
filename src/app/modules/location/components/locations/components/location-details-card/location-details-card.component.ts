import { ChangeDetectionStrategy, Component, input } from "@angular/core";
import { Location } from "../../../../../../core/models/domain/location/location";
import { LocationDetailsComponent } from "../location-details/location-details.component";

@Component({
	selector: "app-location-details-card",
	imports: [LocationDetailsComponent],
	templateUrl: "./location-details-card.component.html",
	styleUrl: "./location-details-card.component.css",
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LocationDetailsCardComponent {
	public location = input.required<Location>();
}
