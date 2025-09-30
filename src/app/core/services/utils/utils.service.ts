import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, Subject } from "rxjs";

@Injectable({
	providedIn: "root",
})
export class UtilsService {
	constructor(private http: HttpClient) {}

	public readJsonAsset(path: string): Observable<any> {
		return this.http.get<any>(path);
	}
}
