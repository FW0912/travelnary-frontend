import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { UtilsService } from "../../../core/services/utils/utils.service";
import { environment } from "../../../../environments/environment";
import { Observable } from "rxjs";
import { ApiResponse } from "../../../core/models/api/api-response";
import { UploadImageDto } from "../models/upload-image-dto";

@Injectable({
	providedIn: "root",
})
export class ImageService {
	private readonly baseApiUrl: string = `${environment.baseApiUrl}/Image`;

	constructor(private http: HttpClient, private utilsService: UtilsService) {}

	public upload(file: File): Observable<ApiResponse<UploadImageDto>> {
		const formData: FormData = new FormData();
		formData.set("file", file);

		return this.http
			.post<ApiResponse<UploadImageDto>>(
				`${this.baseApiUrl}/upload`,
				formData
			)
			.pipe(this.utilsService.generalErrorCatch());
	}

	public uploadShared(
		planId: string,
		file: File,
		token: string
	): Observable<ApiResponse<UploadImageDto>> {
		const formData: FormData = new FormData();
		formData.set("file", file);

		return this.http
			.post<ApiResponse<UploadImageDto>>(
				`${this.baseApiUrl}/upload/shared/${planId}`,
				formData,
				{
					params: {
						token: token,
					},
				}
			)
			.pipe(this.utilsService.generalErrorCatch());
	}
}
//test
