import {
	ChangeDetectionStrategy,
	Component,
	effect,
	input,
	signal,
} from "@angular/core";
import { BaseSharedComponent } from "../../base-shared/base-shared.component";
import { DomSanitizer, SafeUrl } from "@angular/platform-browser";
import { CommonModule } from "@angular/common";

@Component({
	selector: "app-user-image",
	imports: [CommonModule],
	templateUrl: "./user-image.component.html",
	styleUrl: "./user-image.component.css",
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserImageComponent extends BaseSharedComponent {
	public src = input.required<string | null>();
	public alt = input<string>("User");
	protected imageSrc = signal<SafeUrl>("icons/person-circle.svg");
	protected isLoaded = signal<boolean>(false);
	protected isError = signal<boolean>(false);

	constructor(private sanitizer: DomSanitizer) {
		super();

		effect(() => {
			const src = this.src();

			if (src) {
				this.imageSrc.set(this.sanitizer.bypassSecurityTrustUrl(src));
			}
		});
	}

	protected handleErrorEvent(): void {
		this.isError.set(true);
	}

	protected handleLoadEvent(): void {
		this.isLoaded.set(true);
	}
}
