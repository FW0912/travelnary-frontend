import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { ApiResponse } from "../../../core/models/api/api-response";
import { Currency } from "../models/currency";
import { environment } from "../../../../environments/environment";
import { UtilsService } from "../../../core/services/utils/utils.service";

@Injectable({
	providedIn: "root",
})
export class CurrencyService {
	private readonly baseApiUrl: string = `${environment.baseApiUrl}/Currency`;

	constructor(private http: HttpClient, private utilsService: UtilsService) {}

	public getAllCurrency(): Observable<ApiResponse<Array<Currency>>> {
		return this.http
			.get<ApiResponse<Array<Currency>>>(`${this.baseApiUrl}`)
			.pipe(this.utilsService.generalErrorCatch());
	}
}
