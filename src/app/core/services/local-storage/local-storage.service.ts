import { isPlatformBrowser } from "@angular/common";
import { Inject, Injectable, PLATFORM_ID } from "@angular/core";

@Injectable({
	providedIn: "root",
})
export class LocalStorageService {
	constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

	public setItem(key: string, item: any): void {
		if (isPlatformBrowser(this.platformId)) {
			if (typeof item === "string") {
				localStorage.setItem(key, item);
			} else {
				localStorage.setItem(key, JSON.stringify(item));
			}
		}
	}

	public getItem<T = any>(key: string): T | string | null {
		if (isPlatformBrowser(this.platformId)) {
			const item: string | null = localStorage.getItem(key);

			if (item === null) {
				return null;
			}

			try {
				return JSON.parse(item);
			} catch (e) {
				return item;
			}
		} else {
			return null;
		}
	}

	public removeItem(key: string): void {
		if (isPlatformBrowser(this.platformId)) {
			localStorage.removeItem(key);
		}
	}
}
