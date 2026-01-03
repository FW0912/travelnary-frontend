import {
	ChangeDetectionStrategy,
	Component,
	effect,
	input,
	linkedSignal,
	model,
	output,
	signal,
} from "@angular/core";
import { Comment } from "../../../../../../core/models/domain/comment/comment";
import { CommonModule, DatePipe, SlicePipe } from "@angular/common";
import { TimeAgoPipe } from "../../../../../../shared/pipes/time-ago/time-ago.pipe";
import { TextAreaComponent } from "../../../../../../shared/components/inputs/text-area/text-area.component";
import {
	FormBuilder,
	FormControl,
	ReactiveFormsModule,
	Validators,
} from "@angular/forms";
import { BaseFormComponent } from "../../../../../base-form-page/base-form-page.component";
import { MatDialog } from "@angular/material/dialog";
import { ConfirmationPopupComponent } from "../../../../../confirmation-popup/confirmation-popup.component";
import { GetCommentDto } from "../../../../models/get-comment-dto";
import { CommentService } from "../../../../services/comment.service";
import { PostCommentDto } from "../../../../models/post-comment-dto";
import { CommentAction } from "../../../../enums/comment-action";
import { UpdateCommentDto } from "../../../../models/update-comment-dto";
import { UserImageComponent } from "../../../../../../shared/components/images/user-image/user-image.component";
import { SnackbarService } from "../../../../../../core/services/snackbar/snackbar.service";
import { ESnackbarType } from "../../../../../../core/models/utils/others/snackbar-type.enum";
import { AuthService } from "../../../../../../core/services/auth/auth.service";
import { CommentConstants } from "../../../../comment-constants";
import { Router } from "@angular/router";

@Component({
	selector: "app-comment-details",
	imports: [
		TimeAgoPipe,
		CommonModule,
		TextAreaComponent,
		ReactiveFormsModule,
		UserImageComponent,
		SlicePipe,
	],
	templateUrl: "./comment-details.component.html",
	styleUrl: "./comment-details.component.css",
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CommentDetailsComponent extends BaseFormComponent {
	public planId = input.required<string>();
	public comment = model.required<GetCommentDto | null>();
	public depth = input.required<number>();
	public isViewingReplies = input.required<boolean>();
	public isBeingViewed = input.required<boolean>();
	protected userProfilePicture = signal<string | null>(null);
	protected isEditOpen = signal<boolean>(false);
	protected isReplyOpen = signal<boolean>(false);
	protected isRepliesShown = signal<boolean>(false);
	protected replyShownCount = signal<number>(
		CommentConstants.MAX_DEFAULT_REPLIES_SHOWN
	);

	public delete = output<string>();
	public viewReplies = output<GetCommentDto>();

	constructor(
		private fb: FormBuilder,
		private dialog: MatDialog,
		private commentService: CommentService,
		private snackbarService: SnackbarService,
		private router: Router,
		protected authService: AuthService
	) {
		super();

		this.setFormGroup(
			fb.group({
				content: fb.control<string>(""),
				reply: fb.control<string>(""),
			})
		);

		effect(() => {
			const isBeingViewed = this.isBeingViewed();

			if (isBeingViewed) {
				this.replyShownCount.set(
					CommentConstants.MAX_VIEWING_REPLIES_SHOWN
				);
			}
		});
	}

	protected get CommentConstants(): typeof CommentConstants {
		return CommentConstants;
	}

	protected get contentControl(): FormControl<string> {
		return this.formGroup.get("content")! as FormControl;
	}

	protected get replyControl(): FormControl<string> {
		return this.formGroup.get("reply")! as FormControl;
	}

	ngOnInit(): void {
		if (this.authService.isLoggedIn()) {
			this.userProfilePicture.set(
				this.authService.getRequiredUserData().profileUrl
			);
		}
	}

	protected navigateToOwnerProfile(): void {
		if (this.comment()) {
			this.router.navigateByUrl(`/profile/${this.comment()!.owner.id}`);
		}
	}

	protected onLike(): void {
		if (!this.authService.isLoggedIn()) {
			this.snackbarService.openSnackBar(
				"Login to like this comment.",
				ESnackbarType.INFO
			);
			return;
		}

		this.commentService.likeComment(this.comment()!.id).subscribe({
			next: () => {
				this.comment.update((x) => {
					if (x) {
						return {
							...x,
							isLiked: !x.isLiked,
							likeCount: !x.isLiked
								? x.likeCount + 1
								: x.likeCount - 1,
						};
					}

					return x;
				});
			},
		});
	}

	protected openDeletePopup(): void {
		const ref = this.dialog.open(ConfirmationPopupComponent, {
			minWidth: "35%",
		});

		ref.afterClosed().subscribe((x) => {
			if (x) {
				if (
					this.comment()!.replies &&
					this.comment()!.replies!.length > 0
				) {
					this.snackbarService.openSnackBar(
						"This comment cannot be deleted as it already has replies.",
						ESnackbarType.ERROR
					);
					return;
				}
				this.commentService
					.deleteComment(this.comment()!.id)
					.subscribe({
						next: () => {
							this.delete.emit(this.comment()!.id);
						},
					});
			}
		});
	}

	protected deleteReply(replyId: string): void {
		if (this.comment()!.replies) {
			this.comment.update((x) => {
				if (x) {
					return {
						...x,
						replies: x.replies!.filter((y) => y.id !== replyId),
						totalReplies: x.totalReplies - 1,
					};
				}

				return x;
			});

			if (this.comment()!.replies!.length === 0) {
				this.closeReplies();
			}

			this.snackbarService.openSnackBar(
				"Comment successfully deleted.",
				ESnackbarType.INFO
			);
		}
	}

	protected showEditSection(): void {
		this.contentControl.patchValue(this.comment()!.content);
		this.isEditOpen.set(true);
	}

	protected cancelEdit(): void {
		this.isEditOpen.set(false);
	}

	protected onEdit(): void {
		const body: UpdateCommentDto = {
			commentId: this.comment()!.id,
			content: this.contentControl.value,
		};

		this.commentService.updateComment(body).subscribe({
			next: () => {
				this.comment.update((x) => {
					if (x) {
						return { ...x, content: body.content };
					}

					return x;
				});
				this.contentControl.patchValue(body.content);
				this.isEditOpen.set(false);

				this.snackbarService.openSnackBar(
					"Comment successfully edited.",
					ESnackbarType.INFO
				);
			},
		});
	}

	protected showReplySection(): void {
		if (!this.authService.isLoggedIn()) {
			this.snackbarService.openSnackBar(
				"Login to reply to this comment.",
				ESnackbarType.INFO
			);
			return;
		}

		this.isReplyOpen.set(true);
	}

	protected cancelReply(): void {
		this.isReplyOpen.set(false);
	}

	protected onPostReply(): void {
		const body: PostCommentDto = {
			planId: this.planId(),
			parentId: this.comment()!.id,
			content: this.replyControl.value,
		};

		this.commentService.postComment(body).subscribe({
			next: (x) => {
				this.comment.update((y) => {
					if (y) {
						if (y.replies) {
							return {
								...y,
								replies: [...y.replies, x.data.detail],
								totalReplies: y.totalReplies + 1,
							};
						} else {
							return {
								...y,
								replies: [x.data.detail],
								totalReplies: 1,
							};
						}
					}

					return y;
				});
				this.replyControl.patchValue("");
				this.isReplyOpen.set(false);

				this.snackbarService.openSnackBar(
					"Comment replied successfully.",
					ESnackbarType.INFO
				);
			},
		});
	}

	protected showReplies(): void {
		if (!this.comment()!.replies || this.comment()!.replies!.length === 0) {
			this.commentService
				.getCommentReplies(this.comment()!.id, this.replyShownCount())
				.subscribe({
					next: (x) => {
						this.comment.update((y) => {
							if (y) {
								return {
									...y,
									replies: x.data.comments,
								};
							}

							return y;
						});
					},
				});
		}

		this.isRepliesShown.set(true);
	}

	protected showMoreReplies(): void {
		this.commentService
			.getCommentReplies(
				this.comment()!.id,
				this.comment()!.replies!.length +
					CommentConstants.MAX_REPLIES_SHOWN_INCREMENT
			)
			.subscribe({
				next: (x) => {
					const currentRepliesIdSet: Set<string> = new Set(
						this.comment()!.replies!.map((y) => y.id)
					);

					this.comment.update((y) => {
						if (y) {
							return {
								...y,
								replies: [
									...y.replies!,
									...x.data.comments.filter(
										(z) => !currentRepliesIdSet.has(z.id)
									),
								],
							};
						}

						return y;
					});

					this.replyShownCount.set(x.data.comments.length);

					if (!this.isBeingViewed()) {
						this.viewReplies.emit(this.comment()!);
					}
				},
			});
	}

	protected closeReplies(): void {
		this.isRepliesShown.set(false);
	}
}
