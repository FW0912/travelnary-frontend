export interface IApiResponse<T> {
	error_message: {
		english: string;
		indonesian: string;
	} | null;
	data: T | null;
}
