import { Component, Input } from "@angular/core";
import { NavbarLinkComponent } from "./components/navbar-link/navbar-link.component";
import { BorderButtonComponent } from "../../../shared/components/buttons/border-button/border-button.component";
import { ETheme } from "../../models/utils/theme-enum";
import { filter } from "rxjs";
import { UtilsService } from "../../services/utils/utils.service";
import { ThemeService } from "../../services/theme/theme.service";
import { CommonModule } from "@angular/common";
import {
	BreakpointObserver,
	Breakpoints,
	LayoutModule,
} from "@angular/cdk/layout";

@Component({
	selector: "app-navbar",
	imports: [
		NavbarLinkComponent,
		BorderButtonComponent,
		CommonModule,
		LayoutModule,
	],
	templateUrl: "./navbar.component.html",
	styleUrl: "./navbar.component.css",
})
export class NavbarComponent {
	@Input({ required: true }) public theme: ETheme = ETheme.LIGHT;
	protected displayAsList: boolean = false;
	protected isListOpen: boolean = false;
	protected isThemeDropdownOpen: boolean = false;

	constructor(
		private themeService: ThemeService,
		private breakpointObserver: BreakpointObserver
	) {}

	protected get ThemeEnum() {
		return ETheme;
	}

	ngOnInit() {
		this.breakpointObserver
			.observe([Breakpoints.Small, Breakpoints.XSmall])
			.subscribe((x) => (this.displayAsList = x.matches));
	}

	protected toggleList(): void {
		this.isListOpen = !this.isListOpen;
	}

	protected onThemeMouseOver(): void {
		this.isThemeDropdownOpen = true;
	}

	protected onThemeMouseLeave(): void {
		this.isThemeDropdownOpen = false;
	}

	protected toggleThemeDropdown(): void {
		this.isThemeDropdownOpen = !this.isThemeDropdownOpen;
	}

	protected changeTheme(theme: ETheme | null): void {
		this.themeService.changeTheme(theme);
		this.isThemeDropdownOpen = false;
	}
}
