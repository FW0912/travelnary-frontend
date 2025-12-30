import {
	HttpClient,
	HttpErrorResponse,
	HttpStatusCode,
} from "@angular/common/http";
import { Inject, Injectable, PLATFORM_ID } from "@angular/core";
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
import { isPlatformBrowser } from "@angular/common";

@Injectable({
	providedIn: "root",
})
export class UtilsService {
	constructor(
		private http: HttpClient,
		private snackbarService: SnackbarService,
		@Inject(PLATFORM_ID) private platformId: Object
	) {}

	public readJsonAsset(path: string): Observable<any> {
		return this.http.get<any>(path);
	}

	public generalErrorCatch<T>(): OperatorFunction<
		ApiResponse<T>,
		ApiResponse<T>
	> {
		return catchError((err: HttpErrorResponse) => {
			if (
				isPlatformBrowser(this.platformId) &&
				err.status !== HttpStatusCode.Unauthorized
			) {
				const error = err.error;

				if (
					error.errors &&
					error.errors.length > 0 &&
					error.errors[0]
				) {
					this.snackbarService.openSnackBar(
						`${error.errors[0]}!`,
						ESnackbarType.ERROR
					);
				} else if (
					error.errors &&
					Object.entries(error.errors).length > 0
				) {
					this.snackbarService.openSnackBar(
						`${Object.entries(error.errors).at(0)![1]}!`,
						ESnackbarType.ERROR
					);
				} else {
					this.snackbarService.openSnackBar(
						`Unknown error occured, please try again later!`,
						ESnackbarType.ERROR
					);
				}
			}

			return throwError(() => err);
		});
	}
}
