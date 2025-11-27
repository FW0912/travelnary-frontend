import { Location } from "../../../shared/models/common/location";

export interface BaseLocationDto {
	id: string;
	name: string;
	address: string;
	photoUrl: string;
	notes: string;
	location: Location;
	cost: number;
}
