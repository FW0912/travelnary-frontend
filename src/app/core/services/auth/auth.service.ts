import {
	HttpClient,
	HttpContext,
	HttpErrorResponse,
} from "@angular/common/http";
import { Injectable, signal } from "@angular/core";
import { LocalStorageService } from "../local-storage/local-storage.service";
import {
	catchError,
	filter,
	Observable,
	of,
	OperatorFunction,
	switchMap,
	tap,
	throwError,
} from "rxjs";
import { AuthResponse } from "../../models/auth/auth-response";
import { ApiResponse } from "../../models/api/api-response";
import { environment } from "../../../../environments/environment";
import { SnackbarService } from "../snackbar/snackbar.service";
import { ESnackbarType } from "../../models/utils/others/snackbar-type.enum";
import { UtilsService } from "../utils/utils.service";
import { UserProfile } from "../../models/domain/user/user-profile";
import { Router } from "@angular/router";
import { SKIP_REFRESH_TOKEN } from "../../interceptors/refresh-token/refresh-token.interceptor";

@Injectable({
	providedIn: "root",
})
export class AuthService {
	private readonly baseApiUrl: string = `${environment.baseApiUrl}/Auth`;

	public static readonly accessTokenKey: string = "access-token";
	public static readonly accessTokenExpirationKey: string = `${AuthService.accessTokenKey}-expiration`;
	public static readonly refreshTokenKey: string = "refresh-token";
	public static readonly refreshTokenExpirationKey: string = `${AuthService.refreshTokenKey}-expiration`;
	public static readonly userIdKey: string = "user-id";
	public static readonly usernameKey: string = "username";
	public static readonly profileUrlKey: string = "profile-url";

	public isLoggedIn = signal<boolean>(false);

	constructor(
		private router: Router,
		private http: HttpClient,
		private localStorageService: LocalStorageService,
		private snackbarService: SnackbarService,
		private utilsService: UtilsService
	) {}

	public updateIsLoggedIn(isLoggedIn: boolean): void {
		this.isLoggedIn.set(isLoggedIn);
	}

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

	private resetSession(): void {
		this.localStorageService.removeItem(AuthService.accessTokenKey);
		this.localStorageService.removeItem(
			AuthService.accessTokenExpirationKey
		);
		this.localStorageService.removeItem(AuthService.refreshTokenKey);
		this.localStorageService.removeItem(
			AuthService.refreshTokenExpirationKey
		);
		this.localStorageService.removeItem(AuthService.userIdKey);
		this.localStorageService.removeItem(AuthService.usernameKey);
		this.localStorageService.removeItem(AuthService.profileUrlKey);
	}

	private storeRequiredUserData(userProfile: UserProfile): void {
		this.localStorageService.setItem(
			AuthService.userIdKey,
			userProfile.idUser
		);
		this.localStorageService.setItem(
			AuthService.usernameKey,
			userProfile.username
		);
		this.localStorageService.setItem(
			AuthService.profileUrlKey,
			userProfile.profileUrl
		);
	}

	public getRequiredUserData(): {
		userId: string | null;
		username: string | null;
		profileUrl: string | null;
	} {
		return {
			userId: this.localStorageService.getItem(AuthService.userIdKey),
			username: this.localStorageService.getItem(AuthService.usernameKey),
			profileUrl: this.localStorageService.getItem(
				AuthService.profileUrlKey
			),
		};
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
				this.utilsService.generalErrorCatch(),
				tap({
					next: (x) => {
						this.storeAccessToken(x.data);
						this.storeRefreshToken(x.data);
						this.isLoggedIn.set(true);
						this.storeRequiredUserData(x.data.userProfile);
					},
				})
			);
	}

	public logout(): Observable<ApiResponse<boolean>> {
		const body = {
			refreshToken: this.getRefreshToken(),
			revokeAllTokens: true,
		};

		return this.http
			.post<ApiResponse<boolean>>(`${this.baseApiUrl}/logout`, body)
			.pipe(
				this.utilsService.generalErrorCatch(),
				tap({
					next: (x) => {
						if (x.data) {
							this.isLoggedIn.set(false);
							this.resetSession();
							this.router.navigateByUrl("/home");
						}
					},
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
				this.utilsService.generalErrorCatch(),
				tap({
					next: (x) => {
						this.storeAccessToken(x.data);
						this.storeRefreshToken(x.data);
						this.isLoggedIn.set(true);
						this.storeRequiredUserData(x.data.userProfile);
					},
				}),
				filter((x) => x !== null)
			);
	}

	public refreshToken(): Observable<string> {
		const body = {
			refreshToken: this.getRefreshToken(),
		};

		return this.http
			.post<ApiResponse<AuthResponse>>(
				`${this.baseApiUrl}/refresh-token`,
				body,
				{
					context: new HttpContext().set(SKIP_REFRESH_TOKEN, true),
				}
			)
			.pipe(
				catchError((err) => {
					this.snackbarService.openSnackBar(
						"Session expired, please login again.",
						ESnackbarType.ERROR
					);
					this.resetSession();
					this.router.navigateByUrl("/login");

					return throwError(() => err);
				}),
				switchMap((x) => {
					this.storeAccessToken(x.data);
					this.storeRefreshToken(x.data);

					this.storeRequiredUserData(x.data.userProfile);

					return x.data.accessToken;
				})
			);
	}
}
