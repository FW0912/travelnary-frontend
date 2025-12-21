import {
	HttpClient,
	HttpErrorResponse,
	HttpParams,
} from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, catchError, share, switchMap, throwError } from "rxjs";
import { environment } from "../../../../environments/environment";
import { ApiResponse } from "../../../core/models/api/api-response";
import { ESnackbarType } from "../../../core/models/utils/others/snackbar-type.enum";
import { SnackbarService } from "../../../core/services/snackbar/snackbar.service";
import { BasePlanDto } from "../models/base-plan-dto";
import { PaginatedApiResponse } from "../../../core/models/api/paginated-api-response";
import { PlanQuery } from "../models/plan-query";
import { AuthService } from "../../../core/services/auth/auth.service";
import { GetPlanByIdDto } from "../models/get-plan-by-id-dto";
import { UtilsService } from "../../../core/services/utils/utils.service";
import { ModifyPlanDto } from "../models/modify-plan-dto";
import { GeneratePlanShareTokenDto } from "../models/generate-plan-share-token-dto";

@Injectable({
	providedIn: "root",
})
export class PlanService {
	private readonly baseApiUrl: string = `${environment.baseApiUrl}/Plan`;

	constructor(
		private http: HttpClient,
		private snackbarService: SnackbarService,
		private authService: AuthService,
		private utilsService: UtilsService
	) {}

	public browsePlans(
		query: PlanQuery | null,
		page: number = 1,
		pageSize: number = 12
	): Observable<PaginatedApiResponse<Array<BasePlanDto>>> {
		var params: HttpParams = new HttpParams();

		params = params.set("Page", page);
		params = params.set("PageSize", pageSize);

		if (query) {
			Object.entries(query).forEach(([k, v]) => {
				if (v) {
					params = params.set(k, v);
				}
			});
		}

		return this.http
			.get<PaginatedApiResponse<Array<BasePlanDto>>>(
				`${this.baseApiUrl}/browse`,
				{
					params: params,
				}
			)
			.pipe(this.utilsService.generalErrorCatch());
	}

	public getOwnerPlans(
		query: PlanQuery | null,
		page: number = 1,
		pageSize: number = 12
	): Observable<PaginatedApiResponse<Array<BasePlanDto>>> {
		var params: HttpParams = new HttpParams();

		params = params.set("Page", page);
		params = params.set("PageSize", pageSize);

		if (query) {
			Object.entries(query).forEach(([k, v]) => {
				if (v) {
					params = params.set(k, v);
				}
			});
		}

		return this.http
			.get<PaginatedApiResponse<Array<BasePlanDto>>>(
				`${this.baseApiUrl}/owner`,
				{
					params: params,
				}
			)
			.pipe(this.utilsService.generalErrorCatch());
	}

	public getPinnedPlans(
		query: PlanQuery | null,
		page: number = 1,
		pageSize: number = 12
	): Observable<PaginatedApiResponse<Array<BasePlanDto>>> {
		var params: HttpParams = new HttpParams();

		params = params.set("Page", page);
		params = params.set("PageSize", pageSize);

		if (query) {
			Object.entries(query).forEach(([k, v]) => {
				if (v) {
					params = params.set(k, v);
				}
			});
		}

		return this.http
			.get<PaginatedApiResponse<Array<BasePlanDto>>>(
				`${this.baseApiUrl}/pinned`,
				{
					params: params,
				}
			)
			.pipe(this.utilsService.generalErrorCatch());
	}

	public getPlansByUser(
		userId: string,
		query: PlanQuery | null,
		page: number = 1,
		pageSize: number = 4
	): Observable<PaginatedApiResponse<Array<BasePlanDto>>> {
		var params: HttpParams = new HttpParams();

		params = params.set("Page", page);
		params = params.set("PageSize", pageSize);

		if (query) {
			Object.entries(query).forEach(([k, v]) => {
				if (v) {
					params = params.set(k, v);
				}
			});
		}

		return this.http
			.get<PaginatedApiResponse<Array<BasePlanDto>>>(
				`${this.baseApiUrl}/user/${userId}`,
				{
					params: params,
				}
			)
			.pipe(this.utilsService.generalErrorCatch());
	}

	public getPlanById(id: string): Observable<ApiResponse<GetPlanByIdDto>> {
		if (this.authService.getAccessToken()) {
			return this.http
				.get<ApiResponse<GetPlanByIdDto>>(
					`${this.baseApiUrl}/${id}/authorized`
				)
				.pipe(this.utilsService.generalErrorCatch());
		} else {
			return this.http
				.get<ApiResponse<GetPlanByIdDto>>(`${this.baseApiUrl}/${id}`)
				.pipe(this.utilsService.generalErrorCatch());
		}
	}

	public getPlanByToken(
		id: string,
		token: string
	): Observable<ApiResponse<GetPlanByIdDto>> {
		return this.http
			.get<ApiResponse<GetPlanByIdDto>>(
				`${this.baseApiUrl}/${id}/shared`,
				{
					params: {
						Token: token,
					},
				}
			)
			.pipe(this.utilsService.generalErrorCatch());
	}

	public pinPlan(id: string): Observable<ApiResponse<any>> {
		return this.http
			.post<ApiResponse<any>>(`${this.baseApiUrl}/pin/${id}`, null)
			.pipe(this.utilsService.generalErrorCatch());
	}

	public likePlan(id: string): Observable<ApiResponse<any>> {
		return this.http
			.post<ApiResponse<any>>(`${this.baseApiUrl}/like/${id}`, null)
			.pipe(this.utilsService.generalErrorCatch());
	}

	public createPlan(
		dto: ModifyPlanDto
	): Observable<ApiResponse<{ id: string }>> {
		return this.http
			.post<ApiResponse<{ id: string }>>(`${this.baseApiUrl}/create`, dto)
			.pipe(this.utilsService.generalErrorCatch());
	}

	public generateShareToken(
		planId: string,
		shareType: "edit" | "view"
	): Observable<ApiResponse<GeneratePlanShareTokenDto>> {
		return this.http
			.post<ApiResponse<GeneratePlanShareTokenDto>>(
				`${this.baseApiUrl}/${planId}/generate-share-token`,
				{
					shareType: shareType,
				}
			)
			.pipe(this.utilsService.generalErrorCatch());
	}

	public updatePlan(
		id: string,
		dto: ModifyPlanDto
	): Observable<ApiResponse<GetPlanByIdDto>> {
		return this.http
			.put<ApiResponse<GetPlanByIdDto>>(
				`${this.baseApiUrl}/${id}/update`,
				dto
			)
			.pipe(this.utilsService.generalErrorCatch());
	}

	public deletePlan(id: string): Observable<ApiResponse<boolean>> {
		return this.http
			.delete<ApiResponse<boolean>>(`${this.baseApiUrl}/${id}`)
			.pipe(this.utilsService.generalErrorCatch());
	}
}
