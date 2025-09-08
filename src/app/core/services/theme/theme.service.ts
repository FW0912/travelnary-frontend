import { Injectable, signal } from "@angular/core";
import { LocalStorageService } from "../local-storage/local-storage.service";
import { BehaviorSubject } from "rxjs";
import { ETheme } from "../../models/utils/others/theme.enum";

@Injectable({
	providedIn: "root",
})
export class ThemeService {
	public theme = signal<ETheme | null>(null);

	constructor(private localStorageService: LocalStorageService) {}

	public changeTheme(theme: ETheme | null) {
		if (theme != null) {
			this.theme.set(theme);
			this.localStorageService.setItem("theme", theme);
		} else {
			const windowPrefTheme: ETheme = window.matchMedia(
				"(prefers-color-scheme: dark)"
			).matches
				? ETheme.DARK
				: ETheme.LIGHT;
			this.theme.set(windowPrefTheme);
			this.localStorageService.removeItem("theme");
		}
	}
}
