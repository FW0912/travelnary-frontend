export interface SearchLocationQuery {
	Key?: string;
	searchQuery: string;
	Category?: string;
	Phone?: string;
	Address?: string;
	LatLong?: string;
	Radius?: number;
	RadiusUnit?: string;
	Language?: string;
}
