import {
	ApplicationConfig,
	provideBrowserGlobalErrorListeners,
	provideZoneChangeDetection,
} from "@angular/core";
import { provideRouter, withPreloading } from "@angular/router";

import { routes } from "./app.routes";
import {
	provideClientHydration,
	withEventReplay,
} from "@angular/platform-browser";
import {
	provideHttpClient,
	withFetch,
	withInterceptors,
} from "@angular/common/http";
import { provideAnimationsAsync } from "@angular/platform-browser/animations/async";
import { SelectivePreloadingStrategyService } from "./core/services/selective-preloading-strategy/selective-preloading-strategy.service";
import { accessTokenInterceptor } from "./core/interceptors/access-token/access-token.interceptor";
import { refreshTokenInterceptor } from "./core/interceptors/refresh-token/refresh-token.interceptor";
import { loadingInterceptor } from "./core/interceptors/loading/loading.interceptor";

export const appConfig: ApplicationConfig = {
	providers: [
		provideBrowserGlobalErrorListeners(),
		provideZoneChangeDetection({ eventCoalescing: true }),
		provideRouter(
			routes,
			withPreloading(SelectivePreloadingStrategyService)
		),
		provideClientHydration(withEventReplay()),
		provideHttpClient(
			withFetch(),
			withInterceptors([
				loadingInterceptor,
				accessTokenInterceptor,
				refreshTokenInterceptor,
			])
		),
		provideAnimationsAsync(),
	],
};
