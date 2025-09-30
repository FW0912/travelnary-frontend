import { LocationCategory } from "../location-category/location-category";

export interface Location {
	id: string;
	planId: string;
	category: LocationCategory;
	order: number;
	name: string;
	address: string;
	// photo_url: string;
	day: Date;
	notes: string;
	time: Date;
	currencyName: string;
	cost: number;
}
