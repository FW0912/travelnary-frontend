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
import { GetDestinationLocationDto } from "../models/get-destination-details-dto";
import { SnackbarService } from "../../../core/services/snackbar/snackbar.service";
import { ESnackbarType } from "../../../core/models/utils/others/snackbar-type.enum";
import { SKIP_ACCESS_TOKEN } from "../../../core/interceptors/access-token/access-token.interceptor";

@Injectable({
	providedIn: "root",
})
export class LocationService {
	private readonly baseApiUrl: string = `${environment.baseApiUrl}/Location`;

	constructor(
		private http: HttpClient,
		private utilsService: UtilsService,
		private snackbarService: SnackbarService
	) {}

	public getAllLocationCategories(): Observable<
		ApiResponse<Array<LocationCategory>>
	> {
		return this.http
			.get<ApiResponse<Array<LocationCategory>>>(
				`${this.baseApiUrl}/category`
			)
			.pipe(this.utilsService.generalErrorCatch());
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
	): Observable<{ latitude: number; longitude: number; radius: number }> {
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

					const minLatitude = Number.parseFloat(
						destinationDetails.boundingbox.at(0)!
					);
					const maxLatitude = Number.parseFloat(
						destinationDetails.boundingbox.at(1)!
					);
					const minLongitude = Number.parseFloat(
						destinationDetails.boundingbox.at(2)!
					);
					const maxLongitude = Number.parseFloat(
						destinationDetails.boundingbox.at(3)!
					);

					const centerLatitude = (minLatitude + maxLatitude) / 2;
					const centerLongitude = (minLongitude + maxLongitude) / 2;

					const R = 6371; // km
					const deg2rad = (deg: number) => (deg * Math.PI) / 180;

					const dLat = deg2rad(maxLatitude - centerLatitude);
					const dLon = deg2rad(maxLongitude - centerLongitude);

					const a =
						Math.sin(dLat / 2) * Math.sin(dLat / 2) +
						Math.cos(deg2rad(centerLatitude)) *
							Math.cos(deg2rad(maxLatitude)) *
							Math.sin(dLon / 2) *
							Math.sin(dLon / 2);

					const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

					return of({
						latitude: centerLatitude,
						longitude: centerLongitude,
						radius: R * c,
					});
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
