import { Location } from "./location";
import { LocationCategory } from "./location-category";

export interface ModifyLocationDto {
	id: string | null;
	planId: string;
	day: number;
	category: string;
	name: string;
	address: string;
	photoUrl: string | null;
	notes: string;
	location: Location | null;
	time: string | null;
	currencyName: string;
	cost: number | null;
	sortOrder: number | null;
}
