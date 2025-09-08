import {
	ChangeDetectionStrategy,
	Component,
	input,
	Input,
	signal,
} from "@angular/core";
import { BorderButtonComponent } from "../../../shared/components/buttons/border-button/border-button.component";
import { ETheme } from "../../models/utils/others/theme.enum";
import { filter } from "rxjs";
import { UtilsService } from "../../services/utils/utils.service";
import { ThemeService } from "../../services/theme/theme.service";
import { CommonModule } from "@angular/common";
import {
	BreakpointObserver,
	Breakpoints,
	LayoutModule,
} from "@angular/cdk/layout";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { LinkComponent } from "../../../shared/components/link/link.component";

@Component({
	selector: "app-navbar",
	imports: [BorderButtonComponent, CommonModule, LayoutModule, LinkComponent],
	templateUrl: "./navbar.component.html",
	styleUrl: "./navbar.component.css",
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavbarComponent {
	protected displayAsList = signal<boolean>(false);
	protected isListOpen = signal<boolean>(false);
	protected isThemeDropdownOpen = signal<boolean>(false);

	constructor(
		protected themeService: ThemeService,
		private breakpointObserver: BreakpointObserver
	) {
		this.breakpointObserver
			.observe([Breakpoints.Small, Breakpoints.XSmall])
			.pipe(takeUntilDestroyed())
			.subscribe((x) => this.displayAsList.set(x.matches));
	}

	protected get ThemeEnum() {
		return ETheme;
	}

	protected toggleList(): void {
		this.isListOpen.update((state) => !state);
	}

	protected onThemeMouseOver(): void {
		this.isThemeDropdownOpen.set(true);
	}

	protected onThemeMouseLeave(): void {
		this.isThemeDropdownOpen.set(false);
	}

	protected toggleThemeDropdown(): void {
		this.isThemeDropdownOpen.update((state) => !state);
	}

	protected changeTheme(theme: ETheme | null): void {
		this.themeService.changeTheme(theme);
		this.isThemeDropdownOpen.set(false);
	}
}
