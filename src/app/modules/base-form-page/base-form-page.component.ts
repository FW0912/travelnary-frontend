import { ChangeDetectionStrategy, Component } from "@angular/core";
import { Subject } from "rxjs";

@Component({
	selector: "app-base-form-page",
	imports: [],
	template: "",
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BaseFormPageComponent {
	protected formSubmittedObservable: Subject<void> = new Subject();

	protected submit(): void {
		this.formSubmittedObservable.next();
		this.formSubmittedObservable.complete();
	}

	ngOnDestroy(): void {
		this.formSubmittedObservable.complete();
	}
}
