import { RenderMode, ServerRoute } from "@angular/ssr";

export const serverRoutes: ServerRoute[] = [
	{
		path: "view-plan/:id",
		renderMode: RenderMode.Server,
	},
	{
		path: "location-recommendation/:id/:day",
		renderMode: RenderMode.Server,
	},
	{
		path: "**",
		renderMode: RenderMode.Prerender,
	},
];
