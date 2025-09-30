import { EntityValue } from "../../utils/api/entity-value.interface";

export interface Plan {
	id: string;
	user: EntityValue;
	currency: EntityValue;
	name: string;
	description: string;
	destination: string;
	// photo_url: string;
	date_start: Date;
	date_end: Date;
	updated_on: Date;
	is_owner?: boolean;
	is_pinned?: boolean;
	is_liked?: boolean;
	// access: boolean;
	// share_edit: string;
	// share_view: string;
	like_count: number;
	view_count: number;
}
