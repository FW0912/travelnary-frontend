import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { LocalStorageService } from "../local-storage/local-storage.service";
import {
	catchError,
	filter,
	Observable,
	of,
	switchMap,
	throwError,
} from "rxjs";
import { AuthResponse } from "../../models/auth/auth-response";
import { ApiResponse } from "../../models/api/api-response";
import { environment } from "../../../../environments/environment";
import { SnackbarService } from "../snackbar/snackbar.service";
import { ESnackbarType } from "../../models/utils/others/snackbar-type.enum";

@Injectable({
	providedIn: "root",
})
export class AuthService {
	private readonly baseApiUrl: string = `${environment.baseApiUrl}/Auth`;

	public static readonly accessTokenKey: string = "access-token";
	public static readonly accessTokenExpirationKey: string = `${AuthService.accessTokenKey}-expiration`;
	public static readonly refreshTokenKey: string = "refresh-token";
	public static readonly refreshTokenExpirationKey: string = `${AuthService.refreshTokenKey}-expiration`;

	constructor(
		private http: HttpClient,
		private localStorageService: LocalStorageService,
		private snackbarService: SnackbarService
	) {}

	private storeAccessToken(authResponse: AuthResponse): void {
		this.localStorageService.setItem(
			AuthService.accessTokenKey,
			authResponse.accessToken
		);
		this.localStorageService.setItem(
			AuthService.accessTokenExpirationKey,
			authResponse.accessTokenExpiration
		);
	}

	private storeRefreshToken(authResponse: AuthResponse): void {
		this.localStorageService.setItem(
			AuthService.refreshTokenKey,
			authResponse.refreshToken
		);
		this.localStorageService.setItem(
			AuthService.refreshTokenExpirationKey,
			authResponse.refreshTokenExpiration
		);
	}

	public getAccessToken(): string | null {
		return this.localStorageService.getItem(AuthService.accessTokenKey);
	}

	public getRefreshToken(): string | null {
		return this.localStorageService.getItem(AuthService.refreshTokenKey);
	}

	public login(
		username: string,
		password: string,
		rememberMe: boolean
	): Observable<ApiResponse<AuthResponse>> {
		const body = {
			emailOrUsername: username,
			password: password,
		};

		return this.http
			.post<ApiResponse<AuthResponse>>(`${this.baseApiUrl}/login`, body)
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
				}),
				switchMap((x) => {
					this.storeAccessToken(x.data);

					if (rememberMe) {
						this.storeRefreshToken(x.data);
					}

					return of(x);
				})
			);
	}

	public register(
		username: string,
		password: string,
		fullName: string,
		email: string
	): Observable<ApiResponse<AuthResponse>> {
		const body = {
			username: username,
			email: email,
			password: password,
			fullName: fullName,
			gender: "Male",
			bioDescription: "",
			dob: null,
			profileUrl: null,
		};

		return this.http
			.post<ApiResponse<AuthResponse>>(
				`${this.baseApiUrl}/register`,
				body
			)
			.pipe(
				catchError((err) => {
					const error = err.error;

					if (error.errors) {
						console.log(error.errors);
						this.snackbarService.openSnackBar(
							`${Object.values(error.errors)[0]}!`,
							ESnackbarType.ERROR
						);
					} else {
						this.snackbarService.openSnackBar(
							`${error.message}!`,
							ESnackbarType.ERROR
						);
					}

					return throwError(() => err);
				}),
				switchMap((x) => {
					this.storeAccessToken(x.data);

					return of(x);
				}),
				filter((x) => x !== null)
			);
	}

	public refreshToken(): Observable<string> {
		return this.http
			.get<ApiResponse<AuthResponse>>(`${this.baseApiUrl}/refresh-token`)
			.pipe(
				switchMap((x) => {
					this.storeAccessToken(x.data);
					this.storeRefreshToken(x.data);

					return x.data.accessToken;
				})
			);
	}
}
