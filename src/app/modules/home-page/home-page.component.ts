import { Component } from "@angular/core";
import { ButtonComponent } from "../../shared/components/buttons/button/button.component";

@Component({
	selector: "app-home-page",
	imports: [ButtonComponent],
	templateUrl: "./home-page.component.html",
	styleUrl: "./home-page.component.css",
})
export class HomePageComponent {}
