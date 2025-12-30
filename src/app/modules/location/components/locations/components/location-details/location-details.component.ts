import { ChangeDetectionStrategy, Component, input } from "@angular/core";
import { Location } from "../../../../../../core/models/domain/location/location";
import { DatePipe, DecimalPipe } from "@angular/common";
import { MatDialog } from "@angular/material/dialog";
import { GetLocationDto } from "../../../../models/get-location-dto";

@Component({
	selector: "app-location-details",
	imports: [DatePipe, DecimalPipe],
	templateUrl: "./location-details.component.html",
	styleUrl: "./location-details.component.css",
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LocationDetailsComponent {
	public location = input.required<GetLocationDto>();
}
