export interface Comment {
	id: string;
	plan_id: string;
	user: {
		username: string;
		profile_url: string;
	};
	content: string;
	is_reply: boolean;
	reply_list: Array<Comment>;
	posted_date: Date;
	like_count: number;
	is_owner: boolean;
	is_liked: boolean;
}
