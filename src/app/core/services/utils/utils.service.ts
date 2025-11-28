import {
	HttpClient,
	HttpErrorResponse,
	HttpStatusCode,
} from "@angular/common/http";
import { Injectable } from "@angular/core";
import {
	catchError,
	Observable,
	OperatorFunction,
	Subject,
	throwError,
} from "rxjs";
import { ApiResponse } from "../../models/api/api-response";
import { ESnackbarType } from "../../models/utils/others/snackbar-type.enum";
import { SnackbarService } from "../snackbar/snackbar.service";

@Injectable({
	providedIn: "root",
})
export class UtilsService {
	constructor(
		private http: HttpClient,
		private snackbarService: SnackbarService
	) {}

	public readJsonAsset(path: string): Observable<any> {
		return this.http.get<any>(path);
	}

	public generalErrorCatch<T>(): OperatorFunction<
		ApiResponse<T>,
		ApiResponse<T>
	> {
		return catchError((err: HttpErrorResponse) => {
			if (err.status !== HttpStatusCode.Unauthorized) {
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
			}

			return throwError(() => err);
		});
	}
}
