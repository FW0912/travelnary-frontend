import { IValueOption } from "../models/utils/value-option";

export class GeneralUtils {
	public static getOptionList(enumerator: {
		[s: number]: string;
	}): Array<IValueOption> {
		return Object.values(enumerator).map((x, index) => {
			return {
				id: index + 1,
				value: x,
			};
		});
	}
}
