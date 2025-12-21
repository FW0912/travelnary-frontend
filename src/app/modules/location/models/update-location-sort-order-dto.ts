export interface UpdateLocationSortOrderDto {
	planId: string;
	day: number;
	items: Array<{ id: string; sortOrder: number }>;
}
