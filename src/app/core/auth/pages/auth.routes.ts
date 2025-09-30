import { Routes } from "@angular/router";

export const AuthRoutes: Routes = [
	{
		path: "login",
		title: "Login",
		loadComponent: () =>
			import("./login-page/login-page.component").then(
				(c) => c.LoginPageComponent
			),
	},
	{
		path: "register",
		title: "Register",
		loadComponent: () =>
			import("./register-page/register-page.component").then(
				(c) => c.RegisterPageComponent
			),
	},
];
