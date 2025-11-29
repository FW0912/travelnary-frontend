import { DestroyRef, Injectable, signal } from "@angular/core";
import { takeUntilDestroyed, toObservable } from "@angular/core/rxjs-interop";
import { debounceTime, Observable, Subscription, timer } from "rxjs";

@Injectable({
	providedIn: "root",
})
export class LoadingService {
	private requestCount: number = 0;
	private isLoading = signal<boolean>(false);
	public isLoading$ = toObservable(this.isLoading).pipe(debounceTime(300));
	private isMinRequestTimerDone$: Subscription | null = null;
	private minLoadingTimer$: Observable<0> | null = null;
	private isMinLoadingTimerDone$: Subscription | null = null;
	private isMinLoadingTimerDone: boolean = true;

	constructor(private destroyRef: DestroyRef) {}

	public incrementRequestCount(): void {
		this.requestCount++;

		if (!this.isMinRequestTimerDone$) {
			this.isMinRequestTimerDone$ = timer(300)
				.pipe(takeUntilDestroyed(this.destroyRef))
				.subscribe({
					next: () => {
						this.isLoading.set(true);

						this.minLoadingTimer$ = timer(300);
						this.isMinLoadingTimerDone = false;
						this.isMinLoadingTimerDone$ = this.minLoadingTimer$
							.pipe(takeUntilDestroyed(this.destroyRef))
							.subscribe({
								next: () => {
									this.isMinLoadingTimerDone = true;
								},
							});
					},
				});
		}
	}

	public decrementRequestCount(): void {
		this.requestCount--;

		if (this.requestCount === 0) {
			if (this.isMinRequestTimerDone$) {
				this.isMinRequestTimerDone$.unsubscribe();
				this.isMinRequestTimerDone$ = null;
			}

			if (this.minLoadingTimer$ && this.isMinLoadingTimerDone$) {
				if (this.isMinLoadingTimerDone) {
					this.isLoading.set(false);

					this.minLoadingTimer$ = null;
					this.isMinLoadingTimerDone$.unsubscribe();
					this.isMinLoadingTimerDone$ = null;
					this.isMinLoadingTimerDone = true;
				} else {
					this.isMinLoadingTimerDone$.unsubscribe();
					this.isMinLoadingTimerDone$ = null;

					const subscription: Subscription = this.minLoadingTimer$
						.pipe(takeUntilDestroyed(this.destroyRef))
						.subscribe({
							next: () => {
								this.isLoading.set(false);

								this.isMinLoadingTimerDone = true;
								subscription.unsubscribe();
								this.minLoadingTimer$ = null;
							},
						});
				}
			}
		}
	}
}
