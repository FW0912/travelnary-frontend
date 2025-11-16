import { TestBed } from "@angular/core/testing";
import { HttpInterceptorFn } from "@angular/common/http";

import { accessTokenInterceptorInterceptor } from "./access-token-interceptor.interceptor";

describe("accessTokenInterceptorInterceptor", () => {
	const interceptor: HttpInterceptorFn = (req, next) =>
		TestBed.runInInjectionContext(() =>
			accessTokenInterceptorInterceptor(req, next)
		);

	beforeEach(() => {
		TestBed.configureTestingModule({});
	});

	it("should be created", () => {
		expect(interceptor).toBeTruthy();
	});
});
