import { Routes } from "@angular/router";

export const PlanRoutes: Routes = [
	{
		path: "browse-plans",
		title: "Browse Plans",
		loadComponent: () =>
			import("../plans/pages/plans-page/plans-page.component").then(
				(c) => c.PlansPageComponent
			),
	},
	{
		path: "pinned-plans",
		title: "Pinned Plans",
		loadComponent: () =>
			import("../plans/pages/plans-page/plans-page.component").then(
				(c) => c.PlansPageComponent
			),
	},
	{
		path: "your-plans",
		title: "Your Plans",
		loadComponent: () =>
			import("../plans/pages/plans-page/plans-page.component").then(
				(c) => c.PlansPageComponent
			),
	},
	{
		path: "view-plan/:id",
		title: "Plan",
		loadComponent: () =>
			import(
				"../plans/pages/viewer-plan-page/viewer-plan-page.component"
			).then((c) => c.ViewerPlanPageComponent),
	},
];
