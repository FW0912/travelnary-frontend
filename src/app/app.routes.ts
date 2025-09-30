import { Routes } from "@angular/router";
import { AuthRoutes } from "./core/auth/pages/auth.routes";
import { HomeRoute } from "./modules/home-page/home.route";
import { PlanRoutes } from "./modules/plans/plans.routes";

export const routes: Routes = [HomeRoute, ...AuthRoutes, ...PlanRoutes];
