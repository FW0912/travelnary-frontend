import { IEntityValue } from "../../utils/api/entity-value";

export interface IPlan {
	id: string;
	user: IEntityValue;
	currency: IEntityValue;
	name: string;
	description: string;
	destination: string;
	// photo_url: string;
	date_start: Date;
	date_end: Date;
	// access: boolean;
	// share_edit: string;
	// share_view: string;
	// like_count: number;
	// view_count: number;
}
