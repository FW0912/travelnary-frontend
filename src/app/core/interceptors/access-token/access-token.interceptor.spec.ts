import { TestBed } from "@angular/core/testing";
import { HttpInterceptorFn } from "@angular/common/http";

import { accessTokenInterceptor } from "./access-token.interceptor";

describe("accessTokenInterceptorInterceptor", () => {
	const interceptor: HttpInterceptorFn = (req, next) =>
		TestBed.runInInjectionContext(() => accessTokenInterceptor(req, next));

	beforeEach(() => {
		TestBed.configureTestingModule({});
	});

	it("should be created", () => {
		expect(interceptor).toBeTruthy();
	});
});
