import { GetDestinationLocationDto } from "../../modules/location/models/get-destination-location-dto";

type PlaceLevel = "city" | "metro" | "province" | "country" | "unknown";

export class DestinationUtils {
	private static readonly DESTINATION_ALIAS_MAP: Record<string, string> = {
		// Koreas
		"Republic of Korea": "South Korea",
		"Korea, Republic of": "South Korea",
		"Democratic People's Republic of Korea": "North Korea",
		"Korea, Democratic People's Republic of": "North Korea",

		// Russia / Ukraine region
		"Russian Federation": "Russia",

		// USA
		"United States of America": "United States",

		// Middle East
		"Iran, Islamic Republic of": "Iran",
		"Syrian Arab Republic": "Syria",

		// South America
		"Venezuela, Bolivarian Republic of": "Venezuela",
		"Bolivia, Plurinational State of": "Bolivia",

		// Europe
		"Czech Republic": "Czechia",
		"Moldova, Republic of": "Moldova",

		// Africa
		"Tanzania, United Republic of": "Tanzania",

		// Southeast Asia
		"Lao People's Democratic Republic": "Laos",

		// Special cases
		"Palestine, State of": "Palestine",
	};

	public static normalizeDestinationName(input: string): string {
		const trimmed = input.trim();
		return this.DESTINATION_ALIAS_MAP[trimmed] ?? trimmed;
	}

	public static classifyPlaceLevel(
		place: GetDestinationLocationDto
	): PlaceLevel {
		if (place.addresstype === "city" || place.type === "city") {
			return "city";
		}

		if (
			place.addresstype === "province" ||
			place.addresstype === "state" ||
			place.type === "administrative"
		) {
			return "province";
		}

		if (place.addresstype === "country" || place.type === "country") {
			return "country";
		}

		return "unknown";
	}

	public static getSearchRadius(level: PlaceLevel): number {
		switch (level) {
			case "city":
				return 50;
			case "metro":
				return 80;
			case "province":
				return 120;
			case "country":
				return 500;
			default:
				return 100;
		}
	}
}
