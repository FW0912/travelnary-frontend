import {
	afterNextRender,
	ChangeDetectionStrategy,
	Component,
	signal,
} from "@angular/core";
import {
	ActivatedRoute,
	NavigationEnd,
	Router,
	RouterOutlet,
} from "@angular/router";
import { NavbarComponent } from "./core/layout/navbar/navbar.component";
import { CommonModule } from "@angular/common";
import { LocalStorageService } from "./core/services/local-storage/local-storage.service";
import { ETheme } from "./core/models/utils/others/theme.enum";
import { UtilsService } from "./core/services/utils/utils.service";
import { filter, Subscription } from "rxjs";
import { ThemeService } from "./core/services/theme/theme.service";

@Component({
	selector: "app-root",
	imports: [RouterOutlet, NavbarComponent, CommonModule],
	templateUrl: "./app.html",
	styleUrl: "./app.css",
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {
	protected isAuthPage = signal<boolean>(false);

	constructor(
		private router: Router,
		private localStorageService: LocalStorageService,
		protected themeService: ThemeService
	) {
		this.router.events.subscribe((x) => {
			if (
				x instanceof NavigationEnd &&
				(x.url.includes("login") || x.url.includes("register"))
			) {
				this.isAuthPage.set(true);
			} else {
				this.isAuthPage.set(false);
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
			this.themeService.changeTheme(localStorageTheme as ETheme);
		} else if (typeof window !== "undefined") {
			this.themeService.changeTheme(
				window.matchMedia("(prefers-color-scheme: dark)").matches
					? ETheme.DARK
					: ETheme.LIGHT
			);
		} else {
			this.themeService.changeTheme(ETheme.LIGHT);
		}
	}
}
