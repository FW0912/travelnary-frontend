import {
	ChangeDetectionStrategy,
	Component,
	computed,
	input,
	output,
} from "@angular/core";
import { BaseSharedComponent } from "../../base-shared/base-shared.component";
import { Router } from "@angular/router";

@Component({
	selector: "app-base-button",
	imports: [],
	template: "",
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export abstract class BaseButtonComponent extends BaseSharedComponent {
	public href = input<string>("");
	public onClick = output<Event>();
	private readonly baseClasses: string =
		"flex justify-center items-center font-poppins px-4 py-2 text-sm no-underline rounded-lg transition-colors cursor-pointer";
	protected abstract specificClasses: string;

	constructor(private router: Router) {
		super();
	}

	protected class = computed(() => {
		var classes = this.baseClasses.concat(" ", this.specificClasses);
		const extraClasses = this.extraClasses();

		if (extraClasses && extraClasses.length > 0) {
			classes = classes.concat(" ", extraClasses);
		}

		return classes;
	});

	protected onButtonClick(event: Event): void {
		if (this.href().length > 0) {
			this.router.navigateByUrl(this.href());
		}

		this.onClick.emit(event);
	}
}
