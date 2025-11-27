export interface CreatePlanDto {
	name: string;
	description: string;
	destination: string;
	photoUrl: string;
	dateStart: string;
	dateEnd: string;
	currencyId: string;
	isPrivate: boolean;
}
