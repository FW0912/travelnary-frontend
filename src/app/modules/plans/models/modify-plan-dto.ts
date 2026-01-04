export interface ModifyPlanDto {
	name: string;
	description: string;
	destination: string;
	photoUrl: string | null;
	dateStart: string;
	dateEnd: string;
	currencyId: string;
	isPrivate: boolean;
}
