import { SimpleUser } from "../../../core/models/domain/user/simple-user";

export interface BasePlanDto {
	id: string;
	owner: SimpleUser;
	photoUrl: string;
	name: string;
	description: string;
	destination: string;
	dateStart: Date;
	dateEnd: Date;
	updatedOn: Date;
	likeCount: number;
	viewCount: number;
}
