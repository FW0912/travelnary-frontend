import { Location } from "./location";
import { LocationCategory } from "./location-category";

export interface ModifyLocationDto {
	id: string;
	planId: string;
	day: number;
	category: LocationCategory;
	name: string;
	address: string;
	photoUrl: string;
	notes: string;
	location: Location;
	time: string;
	currencyName: string;
	cost: string;
	sortOrder: number;
}
