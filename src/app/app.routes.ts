import { Routes } from "@angular/router";
import { HomePageComponent } from "./modules/home-page/home-page.component";
import { LoginPageComponent } from "./core/auth/pages/login-page/login-page.component";
import { RegisterPageComponent } from "./core/auth/pages/register-page/register-page.component";
import { BrowsePlansPageComponent } from "./modules/plans/browse-plans-page/browse-plans-page.component";

export const routes: Routes = [
	{
		path: "",
		component: HomePageComponent,
	},
	{
		path: "login",
		component: LoginPageComponent,
	},
	{
		path: "register",
		component: RegisterPageComponent,
	},
	{
		path: "browse-plans",
		component: BrowsePlansPageComponent,
	},
];
