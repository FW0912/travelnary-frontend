import { GetLocationDto } from "./get-location-dto";

export interface GetLocationByPlanDto {
	day: number;
	locations: Array<GetLocationDto>;
}
