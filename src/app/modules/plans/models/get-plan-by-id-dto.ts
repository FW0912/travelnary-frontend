import { Currency } from "../../currency/models/currency";
import { BasePlanDto } from "./base-plan-dto";

export interface GetPlanByIdDto extends BasePlanDto {
	currency: Currency;
	isOwner: boolean;
	isLiked: boolean;
	isPinned: boolean;
	isPrivate: boolean;
	isEditor: boolean | null;
}
