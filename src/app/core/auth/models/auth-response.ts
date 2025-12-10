import { UserProfile } from "../../models/domain/user/user-profile";

export interface AuthResponse {
	accessToken: string;
	accessTokenExpiration: string;
	refreshToken: string;
	refreshTokenExpiration: string;
	userProfile: UserProfile;
}
