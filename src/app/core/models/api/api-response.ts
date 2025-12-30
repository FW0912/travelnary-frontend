export interface ApiResponse<T> {
	statusCode: number;
	result: string;
	message: string;
	data: T;
	errors: Array<string>;
	timestamp: Date;
}
