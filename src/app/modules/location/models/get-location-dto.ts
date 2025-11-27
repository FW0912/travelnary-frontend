import { BaseLocationDto } from "./base-location-dto";

export interface GetLocationDto extends BaseLocationDto {
	category: {
		id: string;
		name: string;
		iconUrl: string;
	};
	time: string;
	currencyName: string;
	sortOrder: number;
}
