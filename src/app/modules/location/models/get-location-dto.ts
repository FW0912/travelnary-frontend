import { BaseLocationDto } from "./base-location-dto";

export interface GetLocationDto extends BaseLocationDto {
	category: {
		id: string;
		name: string;
		icon: string;
	};
	time: string;
	currencyName: string;
	sortOrder: number;
}
