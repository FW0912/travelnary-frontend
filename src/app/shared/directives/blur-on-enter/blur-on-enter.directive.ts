import { Directive, ElementRef, HostListener } from "@angular/core";

@Directive({
	selector: "[blurOnEnter]",
})
export class BlurOnEnterDirective {
	constructor(private el: ElementRef) {}

	@HostListener("keyup.enter")
	onEnter() {
		this.el.nativeElement.blur();
	}
}
