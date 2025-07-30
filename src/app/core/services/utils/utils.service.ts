import { Injectable } from "@angular/core";
import { ETheme } from "../../models/utils/theme-enum";
import { BehaviorSubject } from "rxjs";

@Injectable({
	providedIn: "root",
})
export class UtilsService {
	public theme: BehaviorSubject<ETheme | null> =
		new BehaviorSubject<ETheme | null>(null);
}
