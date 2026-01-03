import { Injectable } from "@angular/core";
import { environment } from "../../../../environments/environment";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { ApiResponse } from "../../../core/models/api/api-response";
import { GetCommentDto } from "../models/get-comment-dto";
import { PostCommentDto } from "../models/post-comment-dto";
import { UpdateCommentDto } from "../models/update-comment-dto";
import { UtilsService } from "../../../core/services/utils/utils.service";
import { DetailResponse } from "../../../core/models/api/detail-response";
import { GetCommentByPlanDto } from "../models/get-comment-by-plan-dto";

@Injectable({
	providedIn: "root",
})
export class CommentService {
	private readonly baseApiUrl: string = `${environment.baseApiUrl}/Comment`;

	constructor(private http: HttpClient, private utilsService: UtilsService) {}

	public getCommentByPlan(
		planId: string,
		limit: number = 5
	): Observable<ApiResponse<GetCommentByPlanDto>> {
		return this.http
			.get<ApiResponse<GetCommentByPlanDto>>(
				`${this.baseApiUrl}/plan/${planId}`,
				{
					params: {
						limit: limit,
					},
				}
			)
			.pipe(this.utilsService.generalErrorCatch());
	}

	public getCommentReplies(
		commentId: string,
		limit: number = 3
	): Observable<ApiResponse<GetCommentByPlanDto>> {
		return this.http
			.get<ApiResponse<GetCommentByPlanDto>>(
				`${this.baseApiUrl}/${commentId}/replies/public`,
				{
					params: {
						limit: limit,
					},
				}
			)
			.pipe(this.utilsService.generalErrorCatch());
	}

	public postComment(
		dto: PostCommentDto
	): Observable<ApiResponse<DetailResponse<GetCommentDto>>> {
		return this.http
			.post<ApiResponse<DetailResponse<GetCommentDto>>>(
				this.baseApiUrl,
				dto
			)
			.pipe(this.utilsService.generalErrorCatch());
	}

	public updateComment(
		dto: UpdateCommentDto
	): Observable<ApiResponse<DetailResponse<GetCommentDto>>> {
		return this.http
			.put<ApiResponse<DetailResponse<GetCommentDto>>>(
				this.baseApiUrl,
				dto
			)
			.pipe(this.utilsService.generalErrorCatch());
	}

	public likeComment(commentId: string): Observable<ApiResponse<any>> {
		return this.http
			.post<ApiResponse<any>>(
				`${this.baseApiUrl}/like/${commentId}`,
				null
			)
			.pipe(this.utilsService.generalErrorCatch());
	}

	public deleteComment(commentId: string): Observable<ApiResponse<boolean>> {
		return this.http
			.delete<ApiResponse<boolean>>(`${this.baseApiUrl}/${commentId}`)
			.pipe(this.utilsService.generalErrorCatch());
	}
}
