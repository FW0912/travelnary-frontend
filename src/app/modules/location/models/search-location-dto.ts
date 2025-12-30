import { BaseLocationDto } from "./base-location-dto";

export interface SearchLocationDto {
	id: string;
	category: {
		id: string;
		name: string;
		icon: string;
	};
	name: string;
	address: {
		street1: string;
		city: string;
		country: string;
		postalcode: string;
		address_string: string;
	};
	photoUrl: string;
	rating: string;
	priceLevel: string;
	email: string;
	phoneNumber: string;
	webUrl: string;
	notes: string;
	location: {
		latitude: number;
		longitude: number;
	};
	cost: number;
}
