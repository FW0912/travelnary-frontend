export interface PostCommentDto {
	planId: string;
	parentId: string | null;
	content: string;
}
