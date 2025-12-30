import { ParseErrorMessagePipe } from "./parse-error-message.pipe";

describe("ParseErrorMessagePipe", () => {
	it("create an instance", () => {
		const pipe = new ParseErrorMessagePipe();
		expect(pipe).toBeTruthy();
	});
});
