import { Currency } from "../../../shared/models/common/currency";
import { BasePlanDto } from "./base-plan-dto";

export interface GetPlanByIdDto extends BasePlanDto {
	currency: Currency;
	isOwner: boolean;
	isLiked: boolean;
	isPinned: boolean;
}
