import { Injectable } from "@angular/core";
import { filter, map, Observable, Subject } from "rxjs";
import { EventName } from "../../../shared/enums/event-name";

@Injectable({
	providedIn: "root",
})
export class EventService {
	public eventEmitter$: Subject<{
		eventName: EventName;
		event: any;
	}> = new Subject();

	public emitEvent<T>(eventName: EventName, event: T): void {
		this.eventEmitter$.next({ eventName: eventName, event: event });
	}

	public listen<T>(eventName: EventName): Observable<T> {
		return this.eventEmitter$.asObservable().pipe(
			filter((x) => x.eventName === eventName),
			map((x) => x.event)
		);
	}
}
