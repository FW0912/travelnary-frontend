import { HttpHeaders, HttpInterceptorFn } from "@angular/common/http";
import { inject } from "@angular/core";
import { AuthService } from "../../services/auth/auth.service";

export const accessTokenInterceptorInterceptor: HttpInterceptorFn = (
	req,
	next
) => {
	const authService: AuthService = inject(AuthService);
	const accessToken: string | null = authService.getAccessToken();

	if (accessToken) {
		const reqClone = req.clone({
			setHeaders: {
				Authorization: `Bearer ${accessToken}`,
			},
		});
		return next(reqClone);
	}

	return next(req);
};
