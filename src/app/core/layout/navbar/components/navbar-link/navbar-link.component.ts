import { Component, Input } from "@angular/core";

@Component({
	selector: "app-navbar-link",
	imports: [],
	templateUrl: "./navbar-link.component.html",
	styleUrl: "./navbar-link.component.css",
})
export class NavbarLinkComponent {
	@Input({ required: true }) public label: string = "";
	@Input({ required: true }) public href: string = "";
}
