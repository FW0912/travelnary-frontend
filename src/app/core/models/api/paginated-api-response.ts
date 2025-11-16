export interface PaginatedApiResponse<T> {
	statusCode: number;
	result: string;
	message: string;
	data: {
		data: T;
		page: number;
		pageSize: number;
		totalItems: number;
		totalPages: number;
	};
	errors: Array<string>;
	timestamp: Date;
}
