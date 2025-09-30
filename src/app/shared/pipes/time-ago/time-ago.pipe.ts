import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
	name: "timeAgo",
})
export class TimeAgoPipe implements PipeTransform {
	transform(date: Date): string {
		const now = new Date();
		const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

		if (seconds < 60) {
			return "Just now";
		}

		const intervals: { [key: string]: number } = {
			year: 31536000,
			month: 2592000,
			week: 604800,
			day: 86400,
			hour: 3600,
			minute: 60,
			second: 1,
		};

		let counter;

		for (const i in intervals) {
			counter = Math.floor(seconds / intervals[i]);
			if (counter > 0)
				if (counter === 1) {
					return counter + " " + i + " ago";
				} else {
					return counter + " " + i + "s ago";
				}
		}

		return date.toLocaleDateString();
	}
}
