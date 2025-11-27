import { BaseLocationDto } from "./base-location-dto";

export interface SearchLocationDto extends BaseLocationDto {
	category: {
		name: string;
		localizedName: string;
	};
}
