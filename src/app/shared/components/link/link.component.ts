import { ChangeDetectionStrategy, Component, input } from "@angular/core";
import { Router } from "@angular/router";
import { BaseSharedComponent } from "../base-shared/base-shared.component";

@Component({
	selector: "app-link",
	imports: [],
	templateUrl: "./link.component.html",
	styleUrl: "./link.component.css",
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LinkComponent extends BaseSharedComponent {
	public href = input.required<string>();

	constructor(private router: Router) {
		super();
	}

	protected navigate() {
		this.router.navigateByUrl(this.href());
	}
}
