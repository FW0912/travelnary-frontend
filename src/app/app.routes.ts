import { Routes } from "@angular/router";
import { AuthRoutes } from "./core/auth/pages/auth.routes";
import { HomeRoute } from "./modules/home-page/home.route";
import { PlanRoutes } from "./modules/plans/plans.routes";
import { LocationRoutes } from "./modules/location/locations.routes";

export const routes: Routes = [
	{ path: "", redirectTo: HomeRoute.path, pathMatch: "full" },
	HomeRoute,
	...AuthRoutes,
	...PlanRoutes,
	...LocationRoutes,
];
