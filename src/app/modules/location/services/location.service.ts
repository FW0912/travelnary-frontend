import { HttpClient, HttpContext, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "../../../../environments/environment";
import {
	catchError,
	debounceTime,
	EMPTY,
	Observable,
	of,
	switchMap,
	tap,
} from "rxjs";
import { ApiResponse } from "../../../core/models/api/api-response";
import { GetLocationDto } from "../models/get-location-dto";
import { GetLocationByPlanDto } from "../models/get-location-by-plan-dto";
import { GetLocationByIdDto } from "../models/get-location-by-id-dto";
import { ModifyLocationDto } from "../models/modify-location-dto";
import { UtilsService } from "../../../core/services/utils/utils.service";
import { SearchLocationQuery } from "../models/search-location-query";
import { SearchLocationDto } from "../models/search-location-dto";
import { LocationCategory } from "../models/location-category";
import { UpdateLocationSortOrderDto } from "../models/update-location-sort-order-dto";
import { GetDestinationLocationDto } from "../models/get-destination-location-dto";
import { SnackbarService } from "../../../core/services/snackbar/snackbar.service";
import { ESnackbarType } from "../../../core/models/utils/others/snackbar-type.enum";
import { SKIP_ACCESS_TOKEN } from "../../../core/interceptors/access-token/access-token.interceptor";
import { DestinationUtils } from "../../../shared/utils/destination-utils";
import { DestinationLocationDto } from "../models/destination-location-dto";
import { CacheService } from "../../../core/services/cache/cache.service";

@Injectable({
	providedIn: "root",
})
export class LocationService {
	private readonly baseApiUrl: string = `${environment.baseApiUrl}/Location`;

	constructor(
		private http: HttpClient,
		private utilsService: UtilsService,
		private snackbarService: SnackbarService,
		private cacheService: CacheService
	) {}

	public getAllLocationCategories(): Observable<
		ApiResponse<Array<LocationCategory>>
	> {
		const cacheKey = "location-categories";

		if (this.cacheService.has(cacheKey)) {
			return of(
				this.cacheService.get<ApiResponse<Array<LocationCategory>>>(
					cacheKey
				)!
			);
		}

		return this.http
			.get<ApiResponse<Array<LocationCategory>>>(
				`${this.baseApiUrl}/category`
			)
			.pipe(
				tap({
					next: (x) => {
						this.cacheService.setWithTtl(cacheKey, x);
					},
				}),
				this.utilsService.generalErrorCatch()
			);
	}

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

	public getDestinationLocation(
		destination: string
	): Observable<DestinationLocationDto> {
		const cacheKey = `destination-location-${destination.split(",")[0]}`;

		if (this.cacheService.has(cacheKey)) {
			return of(this.cacheService.get<DestinationLocationDto>(cacheKey)!);
		}

		return this.http
			.get<Array<GetDestinationLocationDto>>(
				`${environment.forwardGeocodeApiUrl}`,
				{
					params: {
						q: destination,
						api_key: environment.geocodeApiKey,
					},
					context: new HttpContext().set(SKIP_ACCESS_TOKEN, true),
				}
			)
			.pipe(
				catchError(() => {
					this.snackbarService.openSnackBar(
						"Error getting destination details, please try again later.",
						ESnackbarType.ERROR
					);
					return EMPTY;
				}),
				switchMap((x) => {
					if (x === null || x.length === 0) {
						this.snackbarService.openSnackBar(
							"Destination not found, please try again later.",
							ESnackbarType.ERROR
						);
						return EMPTY;
					}

					const destinationDetails = x.at(0)!;

					const latitude = Number(destinationDetails.lat);
					const longitude = Number(destinationDetails.lon);
					const placeLevel =
						DestinationUtils.classifyPlaceLevel(destinationDetails);
					const radius = DestinationUtils.getSearchRadius(placeLevel);

					const location = {
						latitude: latitude,
						longitude: longitude,
						radius: radius, // km
					};

					this.cacheService.setWithTtl(cacheKey, location);

					return of(location);
				})
			);
	}

	public searchLocation(
		query: SearchLocationQuery
	): Observable<ApiResponse<Array<SearchLocationDto>>> {
		var params: HttpParams = new HttpParams();

		Object.entries(query).forEach(([k, v]) => {
			if (v) {
				params = params.set(k, v);
			}
		});

		return this.http
			.get<ApiResponse<Array<SearchLocationDto>>>(
				`${this.baseApiUrl}/search`,
				{
					params: params,
				}
			)
			.pipe(this.utilsService.generalErrorCatch());
	}

	public searchNearbyLocation(
		query: SearchLocationQuery
	): Observable<ApiResponse<Array<SearchLocationDto>>> {
		var params: HttpParams = new HttpParams();

		Object.entries(query).forEach(([k, v]) => {
			if (v) {
				params = params.set(k, v);
			}
		});

		return this.http
			.get<ApiResponse<Array<SearchLocationDto>>>(
				`${this.baseApiUrl}/nearby`,
				{
					params: params,
				}
			)
			.pipe(this.utilsService.generalErrorCatch());
	}

	public createLocation(
		dto: ModifyLocationDto
	): Observable<ApiResponse<any>> {
		return this.http
			.post<ApiResponse<any>>(`${this.baseApiUrl}/save`, dto)
			.pipe(this.utilsService.generalErrorCatch());
	}

	public createSharedLocation(
		dto: ModifyLocationDto,
		token: string
	): Observable<ApiResponse<any>> {
		return this.http
			.post<ApiResponse<any>>(`${this.baseApiUrl}/shared/save`, dto, {
				params: {
					shareToken: token,
				},
			})
			.pipe(this.utilsService.generalErrorCatch());
	}

	public updateLocation(
		dto: ModifyLocationDto
	): Observable<ApiResponse<any>> {
		return this.http
			.post<ApiResponse<any>>(`${this.baseApiUrl}/save`, dto)
			.pipe(this.utilsService.generalErrorCatch());
	}

	public updateSharedLocation(
		dto: ModifyLocationDto,
		token: string
	): Observable<ApiResponse<any>> {
		return this.http
			.post<ApiResponse<any>>(`${this.baseApiUrl}/shared/save`, dto, {
				params: {
					shareToken: token,
				},
			})
			.pipe(this.utilsService.generalErrorCatch());
	}

	public updateLocationSortOrder(
		dto: UpdateLocationSortOrderDto
	): Observable<ApiResponse<boolean>> {
		return this.http
			.put<ApiResponse<boolean>>(`${this.baseApiUrl}/sortOrder`, dto)
			.pipe(this.utilsService.generalErrorCatch());
	}

	public updateSharedLocationSortOrder(
		dto: UpdateLocationSortOrderDto,
		token: string
	): Observable<ApiResponse<boolean>> {
		return this.http
			.put<ApiResponse<boolean>>(
				`${this.baseApiUrl}/shared/sortOrder`,
				dto,
				{
					params: {
						shareToken: token,
					},
				}
			)
			.pipe(this.utilsService.generalErrorCatch());
	}

	public deleteLocation(id: string): Observable<ApiResponse<boolean>> {
		return this.http
			.delete<ApiResponse<any>>(`${this.baseApiUrl}/${id}`)
			.pipe(this.utilsService.generalErrorCatch());
	}
}
