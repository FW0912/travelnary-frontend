import { Location } from "./location";
import { LocationCategory } from "./location-category";

export interface ModifyLocationDto {
	id: string;
	planId: string;
	day: number;
	category: LocationCategory;
	name: string;
	address: string;
	photoUrl: string | null;
	notes: string;
	location: Location;
	time: string | null;
	currencyName: string;
	cost: number | null;
	sortOrder: number;
}
