import { inject } from "@angular/core";
import { SafeUrlPipe } from "./safe-url.pipe";
import { DomSanitizer } from "@angular/platform-browser";

describe("SafeUrlPipe", () => {
	it("create an instance", () => {
		const sanitizer = inject(DomSanitizer);
		const pipe = new SafeUrlPipe(sanitizer);
		expect(pipe).toBeTruthy();
	});
});
