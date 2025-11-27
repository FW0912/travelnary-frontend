import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "../../../../environments/environment";
import { Observable } from "rxjs";
import { ApiResponse } from "../../../core/models/api/api-response";
import { GetLocationDto } from "../models/get-location-dto";
import { GetLocationByPlanDto } from "../models/get-location-by-plan-dto";
import { GetLocationByIdDto } from "../models/get-location-by-id-dto";

@Injectable({
	providedIn: "root",
})
export class LocationService {
	private readonly baseApiUrl: string = `${environment.baseApiUrl}/Location`;

	constructor(private http: HttpClient) {}

	public getLocationByPlan(
		planId: string
	): Observable<ApiResponse<Array<GetLocationByPlanDto>>> {
		return this.http.get<ApiResponse<Array<GetLocationByPlanDto>>>(
			`${this.baseApiUrl}/plan/${planId}`
		);
	}

	public getLocationById(
		id: string
	): Observable<ApiResponse<GetLocationByIdDto>> {
		return this.http.get<ApiResponse<GetLocationByIdDto>>(
			`${this.baseApiUrl}/${id}`
		);
	}
}
