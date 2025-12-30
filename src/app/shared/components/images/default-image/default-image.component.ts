import { Component, effect, input, signal } from "@angular/core";
import { SafeUrl, DomSanitizer } from "@angular/platform-browser";
import { BaseSharedComponent } from "../../base-shared/base-shared.component";
import { CommonModule } from "@angular/common";

@Component({
	selector: "app-default-image",
	imports: [CommonModule],
	templateUrl: "./default-image.component.html",
	styleUrl: "./default-image.component.css",
})
export class DefaultImageComponent extends BaseSharedComponent {
	public src = input.required<string | null>();
	public alt = input<string>("image");
	protected imageSrc = signal<SafeUrl>("icons/image.svg");
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
