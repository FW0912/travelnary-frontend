import { GetCommentDto } from "./get-comment-dto";

export interface GetCommentByPlanDto {
	totalComments: number;
	comments: Array<GetCommentDto>;
}
