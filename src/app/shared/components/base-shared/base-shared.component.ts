import { ChangeDetectionStrategy, Component, input } from "@angular/core";

@Component({
	selector: "app-base-shared",
	imports: [],
	template: "",
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export abstract class BaseSharedComponent {
	public extraClasses = input<string>();
}
