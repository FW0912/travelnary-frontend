import { UserProfile } from "../domain/user/user-profile";

export interface AuthResponse {
	accessToken: string;
	accessTokenExpiration: string;
	refreshToken: string;
	refreshTokenExpiration: string;
	userProfile: UserProfile;
}
