import { EPlanFilterType } from "./../enums/plan-filter-type-enum";
import { IValueOption } from "./../models/utils/value-option";

export class PlanUtils {
	public static getPlanFilterTypeOptionList(): Array<IValueOption> {
		return Object.values(EPlanFilterType).map((x, index) => {
			return {
				id: index + 1,
				value: x,
			};
		});
	}
}
