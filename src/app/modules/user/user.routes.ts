import { Routes } from "@angular/router";

export const UserRoutes: Routes = [
	{
		path: "profile/:id",
		title: "Profile",
		loadComponent: () =>
			import("../user/pages/profile-page/profile-page.component").then(
				(c) => c.ProfilePageComponent
			),
	},
];
