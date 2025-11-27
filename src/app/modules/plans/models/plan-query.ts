export interface PlanQuery {
	Search: string;
	Destination: string | null;
	DateStart: string | null;
	DateEnd: string | null;
	Days: number | null;
	OrderBy: number | null;
}
