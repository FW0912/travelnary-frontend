import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, catchError, throwError } from "rxjs";
import { environment } from "../../../../environments/environment";
import { ApiResponse } from "../../../core/models/api/api-response";
import { ESnackbarType } from "../../../core/models/utils/others/snackbar-type.enum";
import { SnackbarService } from "../../../core/services/snackbar/snackbar.service";
import { BasePlanDto } from "../models/base-plan-dto";
import { PaginatedApiResponse } from "../../../core/models/api/paginated-api-response";

@Injectable({
	providedIn: "root",
})
export class PlanService {
	private readonly baseApiUrl: string = `${environment.baseApiUrl}/Plan`;

	constructor(
		private http: HttpClient,
		private snackbarService: SnackbarService
	) {}

	public browsePlans(
		query: {
			nameFilter?: string;
			destinationFilter?: string;
			startDateFilter?: Date;
			endDateFilter?: Date;
			daysFilter?: number;
		},
		page: number = 1,
		pageSize: number = 10
	): Observable<PaginatedApiResponse<Array<BasePlanDto>>> {
		return this.http
			.get<PaginatedApiResponse<Array<BasePlanDto>>>(
				`${this.baseApiUrl}/browse`
			)
			.pipe(
				catchError((err: HttpErrorResponse) => {
					const error = err.error;

					if (error.errors && error.errors.length > 0) {
						this.snackbarService.openSnackBar(
							`${error.errors[0]}!`,
							ESnackbarType.ERROR
						);
					} else {
						this.snackbarService.openSnackBar(
							`${error.message}!`,
							ESnackbarType.ERROR
						);
					}

					return throwError(() => err);
				})
			);
	}
}
