import { SimpleUser } from "../../../core/models/domain/user/simple-user";

export interface GetCommentDto {
	id: string;
	owner: SimpleUser;
	content: string;
	isReply: true;
	createdDate: string;
	replies: Array<GetCommentDto> | null;
	likeCount: number;
	isOwner: boolean;
	isLiked: boolean;
	totalReplies: number;
}
