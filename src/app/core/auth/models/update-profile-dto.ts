export interface UpdateProfileDto {
	email: string;
	fullName: string | null;
	description: string | null;
	birthday: string | null;
	gender: string | null;
	profilePicture: string | null;
}
