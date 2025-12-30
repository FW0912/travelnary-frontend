import { SimpleUser } from "../../../core/models/domain/user/simple-user";

export interface BasePlanDto {
	id: string;
	owner: SimpleUser;
	photoUrl: string;
	name: string;
	description: string;
	destination: string;
	dateStart: string;
	dateEnd: string;
	updatedOn: string;
	likeCount: number;
	viewCount: number;
}
