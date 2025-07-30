import { afterNextRender, Component, signal } from "@angular/core";
import {
	ActivatedRoute,
	NavigationEnd,
	Router,
	RouterOutlet,
} from "@angular/router";
import { NavbarComponent } from "./core/layout/navbar/navbar.component";
import { CommonModule } from "@angular/common";
import { LocalStorageService } from "./core/services/local-storage/local-storage.service";
import { ETheme } from "./core/models/utils/others/theme-enum";
import { UtilsService } from "./core/services/utils/utils.service";
import { filter, Subscription } from "rxjs";
import { ThemeService } from "./core/services/theme/theme.service";

@Component({
	selector: "app-root",
	imports: [RouterOutlet, NavbarComponent, CommonModule],
	templateUrl: "./app.html",
	styleUrl: "./app.css",
})
export class App {
	protected theme: ETheme = ETheme.LIGHT;
	protected themeSubscription!: Subscription;
	protected isAuthPage: boolean = false;

	constructor(
		private router: Router,
		private localStorageService: LocalStorageService,
		private themeService: ThemeService
	) {
		this.router.events.subscribe((x) => {
			if (
				x instanceof NavigationEnd &&
				(x.url.includes("login") || x.url.includes("register"))
			) {
				this.isAuthPage = true;
			} else {
				this.isAuthPage = false;
			}
		});
	}

	protected get ThemeEnum() {
		return ETheme;
	}

	ngOnInit() {
		const localStorageTheme =
			this.localStorageService.getItem<ETheme>("theme");

		if (localStorageTheme != null) {
			this.theme = localStorageTheme as ETheme;
		} else if (typeof window !== "undefined") {
			this.theme = window.matchMedia("(prefers-color-scheme: dark)")
				.matches
				? ETheme.DARK
				: ETheme.LIGHT;
		} else {
			this.theme = ETheme.LIGHT;
		}

		this.themeService.changeTheme(this.theme);
		this.themeSubscription = this.themeService.theme
			.pipe(filter((x) => x != null))
			.subscribe((x) => (this.theme = x));
	}

	ngOnDestroy() {
		this.themeSubscription.unsubscribe();
	}
}
