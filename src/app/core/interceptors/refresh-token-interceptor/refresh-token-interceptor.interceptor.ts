import {
	HttpErrorResponse,
	HttpInterceptorFn,
	HttpStatusCode,
} from "@angular/common/http";
import { AuthService } from "../../services/auth/auth.service";
import { inject } from "@angular/core";
import { catchError, throwError } from "rxjs";

export const refreshTokenInterceptorInterceptor: HttpInterceptorFn = (
	req,
	next
) => {
	const authService: AuthService = inject(AuthService);

	return next(req).pipe(
		catchError((err: HttpErrorResponse) => {
			if (
				err.status === HttpStatusCode.Forbidden &&
				authService.getRefreshToken() !== null
			) {
				authService.refreshToken().subscribe({
					next: (x) => {
						const reqClone = req.clone({
							setHeaders: {
								Authorization: `Bearer ${authService.getRefreshToken()}`,
							},
						});

						return next(reqClone);
					},
				});
			}

			return throwError(() => err);
		})
	);
};
