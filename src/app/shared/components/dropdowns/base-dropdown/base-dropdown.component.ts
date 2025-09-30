import {
	ChangeDetectionStrategy,
	Component,
	effect,
	ElementRef,
	input,
	output,
	signal,
} from "@angular/core";
import { BaseSharedComponent } from "../../base-shared/base-shared.component";
import { IValueOption } from "../../../models/utils/value-option";
import { EventService } from "../../../../core/services/event/event.service";
import { EventName } from "../../../enums/event-name";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";

@Component({
	selector: "app-base-dropdown",
	imports: [],
	template: "",
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export abstract class BaseDropdownComponent extends BaseSharedComponent {
	public optionList = input.required<Array<IValueOption>>();
	public widthClass = input.required<string>();
	public initialOption = input<IValueOption | null>(null);
	public placeholder = input<string | null>(null);
	public contentClass = input<string>("");
	protected selectedOption = signal<IValueOption | null>(null, {
		equal: (a, b) => a?.id === b?.id && a?.value === b?.value,
	});
	protected isDropdownOpen = signal<boolean>(false);
	public onSelected = output<IValueOption | null>();

	constructor(private eventService: EventService, private elRef: ElementRef) {
		super();

		effect(() => {
			const initialOption = this.initialOption();

			if (initialOption !== null) {
				this.selectedOption.set(initialOption);
			}
		});

		eventService
			.listen<MouseEvent>(EventName.DOCUMENT_CLICK)
			.pipe(takeUntilDestroyed())
			.subscribe((x) => {
				if (
					!(elRef.nativeElement as HTMLElement).contains(
						x.target! as HTMLElement
					)
				) {
					this.isDropdownOpen.set(false);
				}
			});
	}

	protected toggleDropdown() {
		this.isDropdownOpen.update((state) => !state);
	}

	protected onOptionSelected(option: IValueOption) {
		this.selectedOption.set(option);
		this.onSelected.emit(option);
		this.isDropdownOpen.set(false);
	}
}
