import { Location } from "@angular/common";
import { Injectable } from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { NavigationEnd, Router } from "@angular/router";

@Injectable({
	providedIn: "root",
})
export class NavigationService {
	private history: Array<string> = new Array();

	constructor(private router: Router, private location: Location) {
		this.router.events.pipe(takeUntilDestroyed()).subscribe((e) => {
			if (e instanceof NavigationEnd) {
				this.history.push(e.urlAfterRedirects);
			}
		});
	}

	public back(): void {
		this.history.pop();

		if (this.history.length > 0) {
			this.location.back();
		} else {
			this.router.navigateByUrl("/home");
		}
	}
}
