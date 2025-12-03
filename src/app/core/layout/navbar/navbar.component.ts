import {
	ChangeDetectionStrategy,
	Component,
	ElementRef,
	Inject,
	input,
	Input,
	PLATFORM_ID,
	QueryList,
	signal,
	ViewChild,
	ViewChildren,
} from "@angular/core";
import { BorderButtonComponent } from "../../../shared/components/buttons/border-button/border-button.component";
import { ETheme } from "../../models/utils/others/theme.enum";
import { filter } from "rxjs";
import { UtilsService } from "../../services/utils/utils.service";
import { ThemeService } from "../../services/theme/theme.service";
import { CommonModule, isPlatformBrowser } from "@angular/common";
import {
	BreakpointObserver,
	Breakpoints,
	LayoutModule,
} from "@angular/cdk/layout";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { LinkComponent } from "../../../shared/components/link/link.component";
import { AuthService } from "../../services/auth/auth.service";
import { EventService } from "../../services/event/event.service";
import { EventName } from "../../../shared/enums/event-name";
import { UserImageComponent } from "../../../shared/components/images/user-image/user-image.component";
import { Router } from "@angular/router";
import { SnackbarService } from "../../services/snackbar/snackbar.service";
import { ESnackbarType } from "../../models/utils/others/snackbar-type.enum";
import { MatDialog } from "@angular/material/dialog";

@Component({
	selector: "app-navbar",
	imports: [
		BorderButtonComponent,
		CommonModule,
		LayoutModule,
		LinkComponent,
		UserImageComponent,
	],
	templateUrl: "./navbar.component.html",
	styleUrl: "./navbar.component.css",
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavbarComponent {
	@ViewChildren("themeDropdown")
	private themeDropdown!: QueryList<ElementRef>;
	@ViewChild("userDropdown") private userDropdown?: ElementRef;
	@ViewChild("list") private list?: ElementRef;

	protected displayAsList = signal<boolean>(false);
	protected isListOpen = signal<boolean>(false);
	protected isThemeDropdownOpen = signal<boolean>(false);
	protected isUserDropdownOpen = signal<boolean>(false);

	constructor(
		protected themeService: ThemeService,
		protected authService: AuthService,
		private eventService: EventService,
		private snackbarService: SnackbarService,
		private dialog: MatDialog,
		private router: Router,
		private breakpointObserver: BreakpointObserver,
		@Inject(PLATFORM_ID) private platformId: Object
	) {
		if (isPlatformBrowser(this.platformId)) {
			this.breakpointObserver
				.observe([Breakpoints.Small, Breakpoints.XSmall])
				.pipe(takeUntilDestroyed())
				.subscribe((x) => this.displayAsList.set(x.matches));
		}

		this.eventService
			.listen<MouseEvent>(EventName.DOCUMENT_CLICK)
			.pipe(takeUntilDestroyed())
			.subscribe((x) => {
				if (
					this.themeDropdown &&
					this.isThemeDropdownOpen() &&
					this.themeDropdown.some(
						(y) =>
							!(y.nativeElement as HTMLElement).contains(
								x.target! as HTMLElement
							)
					)
				) {
					this.isThemeDropdownOpen.set(false);
				}

				if (
					this.userDropdown &&
					this.isUserDropdownOpen() &&
					!(this.userDropdown.nativeElement as HTMLElement).contains(
						x.target! as HTMLElement
					)
				) {
					this.isUserDropdownOpen.set(false);
				}

				if (
					this.list &&
					this.isListOpen() &&
					!(this.list.nativeElement as HTMLElement).contains(
						x.target! as HTMLElement
					)
				) {
					this.isListOpen.set(false);
				}
			});
	}

	protected get ThemeEnum() {
		return ETheme;
	}

	protected toggleList(): void {
		this.isListOpen.update((state) => !state);
	}

	protected toggleThemeDropdown(): void {
		this.isThemeDropdownOpen.update((state) => !state);
	}

	protected toggleUserDropdown(): void {
		this.isUserDropdownOpen.update((state) => !state);
	}

	protected changeTheme(theme: ETheme | null): void {
		this.themeService.changeTheme(theme);
		this.isThemeDropdownOpen.set(false);
	}

	protected profile(): void {
		const userId: string | null =
			this.authService.getRequiredUserData().userId;

		if (!userId) {
			this.snackbarService.openSnackBar(
				"User not found!",
				ESnackbarType.ERROR
			);
			return;
		}

		this.router.navigateByUrl(`/profile/${userId}`);
	}

	protected settings(): void {}

	protected logout(): void {
		this.authService.logout().subscribe();
	}
}
