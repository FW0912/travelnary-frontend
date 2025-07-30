import { Injectable } from "@angular/core";
import { LocalStorageService } from "../local-storage/local-storage.service";
import { BehaviorSubject } from "rxjs";
import { ETheme } from "../../models/utils/theme-enum";

@Injectable({
	providedIn: "root",
})
export class ThemeService {
	public theme: BehaviorSubject<ETheme | null> =
		new BehaviorSubject<ETheme | null>(null);

	constructor(private localStorageService: LocalStorageService) {}

	public changeTheme(theme: ETheme | null) {
		if (theme != null) {
			this.theme.next(theme);
			this.localStorageService.setItem("theme", theme);
		} else {
			const windowPrefTheme: ETheme = window.matchMedia(
				"(prefers-color-scheme: dark)"
			).matches
				? ETheme.DARK
				: ETheme.LIGHT;
			this.theme.next(windowPrefTheme);
			this.localStorageService.removeItem("theme");
		}
	}
}
