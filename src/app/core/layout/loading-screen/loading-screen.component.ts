import { Component } from "@angular/core";
import { LoadingService } from "../../services/loading/loading.service";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { fadeInOutAnimation } from "../../../shared/animations/fade-in-out.animation";
import { AsyncPipe } from "@angular/common";

@Component({
	selector: "app-loading-screen",
	imports: [MatProgressSpinnerModule, AsyncPipe],
	templateUrl: "./loading-screen.component.html",
	styleUrl: "./loading-screen.component.css",
	host: {
		class: "w-full h-full",
	},
	animations: [fadeInOutAnimation],
})
export class LoadingScreenComponent {
	constructor(protected loadingService: LoadingService) {}
}
