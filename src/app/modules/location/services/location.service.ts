import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "../../../../environments/environment";
import { Observable } from "rxjs";
import { ApiResponse } from "../../../core/models/api/api-response";
import { GetLocationDto } from "../models/get-location-dto";
import { GetLocationByPlanDto } from "../models/get-location-by-plan-dto";
import { GetLocationByIdDto } from "../models/get-location-by-id-dto";
import { ModifyLocationDto } from "../models/modify-location-dto";
import { UtilsService } from "../../../core/services/utils/utils.service";
import { SearchLocationQuery } from "../models/search-location-query";
import { SearchLocationDto } from "../models/search-location-dto";

@Injectable({
	providedIn: "root",
})
export class LocationService {
	private readonly baseApiUrl: string = `${environment.baseApiUrl}/Location`;

	constructor(private http: HttpClient, private utilsService: UtilsService) {}

	public getLocationByPlan(
		planId: string
	): Observable<ApiResponse<Array<GetLocationByPlanDto>>> {
		return this.http
			.get<ApiResponse<Array<GetLocationByPlanDto>>>(
				`${this.baseApiUrl}/plan/${planId}`
			)
			.pipe(this.utilsService.generalErrorCatch());
	}

	public getLocationById(
		id: string
	): Observable<ApiResponse<GetLocationByIdDto>> {
		return this.http
			.get<ApiResponse<GetLocationByIdDto>>(`${this.baseApiUrl}/${id}`)
			.pipe(this.utilsService.generalErrorCatch());
	}

	public searchLocation(
		query: SearchLocationQuery
	): Observable<ApiResponse<SearchLocationDto>> {
		var params: HttpParams = new HttpParams();

		Object.entries(query).forEach(([k, v]) => {
			if (v) {
				params = params.set(k, v);
			}
		});

		return this.http
			.get<ApiResponse<SearchLocationDto>>(`${this.baseApiUrl}/search`, {
				params: params,
			})
			.pipe(this.utilsService.generalErrorCatch());
	}

	public createLocation(
		dto: ModifyLocationDto
	): Observable<ApiResponse<any>> {
		return this.http
			.post<ApiResponse<any>>(`${this.baseApiUrl}/save`, dto)
			.pipe(this.utilsService.generalErrorCatch());
	}

	public deleteLocation(id: string): Observable<ApiResponse<boolean>> {
		return this.http
			.delete<ApiResponse<any>>(`${this.baseApiUrl}/${id}`)
			.pipe(this.utilsService.generalErrorCatch());
	}
}
