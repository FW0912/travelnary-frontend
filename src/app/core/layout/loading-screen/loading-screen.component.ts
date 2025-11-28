import { Component } from "@angular/core";
import { LoadingService } from "../../services/loading/loading.service";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { fadeInOutAnimation } from "../../../shared/animations/fade-in-out.animation";

@Component({
	selector: "app-loading-screen",
	imports: [MatProgressSpinnerModule],
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
