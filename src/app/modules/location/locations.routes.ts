import { Routes } from "@angular/router";

export const LocationRoutes: Routes = [
	{
		path: "location-recommendation/:id/:day",
		title: "Location Recommendations",
		loadComponent: () =>
			import(
				"./pages/location-recommendation-page/location-recommendation-page.component"
			).then((c) => c.LocationRecommendationPageComponent),
	},
];
