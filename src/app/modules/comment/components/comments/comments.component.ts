import {
	ChangeDetectionStrategy,
	Component,
	input,
	output,
	signal,
} from "@angular/core";
import { Comment } from "../../../../core/models/domain/comment/comment";
import { TextAreaComponent } from "../../../../shared/components/inputs/text-area/text-area.component";
import { BaseFormComponent } from "../../../base-form-page/base-form-page.component";
import {
	FormBuilder,
	Validators,
	FormsModule,
	ReactiveFormsModule,
	FormControl,
} from "@angular/forms";
import { CommonModule } from "@angular/common";
import { CommentDetailsComponent } from "./components/comment-details/comment-details.component";
import { CommentService } from "../../services/comment.service";
import { PostCommentDto } from "../../models/post-comment-dto";
import { GetCommentDto } from "../../models/get-comment-dto";
import { CommentAction } from "../../enums/comment-action";
import { UserImageComponent } from "../../../../shared/components/images/user-image/user-image.component";
import { GetCommentByPlanDto } from "../../models/get-comment-by-plan-dto";
import { AuthService } from "../../../../core/services/auth/auth.service";
import { SnackbarService } from "../../../../core/services/snackbar/snackbar.service";
import { ESnackbarType } from "../../../../core/models/utils/others/snackbar-type.enum";

@Component({
	selector: "app-comments",
	imports: [
		TextAreaComponent,
		FormsModule,
		ReactiveFormsModule,
		CommonModule,
		CommentDetailsComponent,
		UserImageComponent,
	],
	templateUrl: "./comments.component.html",
	styleUrl: "./comments.component.css",
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CommentsComponent extends BaseFormComponent {
	public planId = input.required<string>();
	public planOwnerProfilePicture = input.required<string>();
	public comments = input.required<GetCommentByPlanDto>();
	public viewedComment = signal<GetCommentDto | null>(null);

	public post = output<GetCommentDto>();
	public delete = output<string>();

	constructor(
		private fb: FormBuilder,
		private commentService: CommentService,
		private snackbarService: SnackbarService,
		protected authService: AuthService
	) {
		super();

		this.setFormGroup(
			fb.group({
				comment: fb.control<string>(""),
			})
		);
	}

	protected get commentControl(): FormControl<string> {
		return this.formGroup.get("comment")! as FormControl;
	}

	protected postComment(): void {
		const body: PostCommentDto = {
			planId: this.planId(),
			parentId: null,
			content: this.commentControl.value,
		};

		this.commentService.postComment(body).subscribe({
			next: (x) => {
				this.commentControl.patchValue("");
				this.post.emit(x.data.detail);
				this.snackbarService.openSnackBar(
					"Comment successfully posted.",
					ESnackbarType.INFO
				);
			},
		});
	}

	protected viewCommentReplies(comment: GetCommentDto): void {
		this.viewedComment.set(comment);
		this.snackbarService.openSnackBar(
			"Showing more replies.",
			ESnackbarType.INFO
		);
	}

	protected unviewCommentReplies(): void {
		this.viewedComment.set(null);
		this.snackbarService.openSnackBar(
			"Closing replies.",
			ESnackbarType.INFO
		);
	}

	protected deleteComment(commentId: string): void {
		this.delete.emit(commentId);
		this.snackbarService.openSnackBar(
			"Comment successfully deleted.",
			ESnackbarType.INFO
		);
	}

	protected deleteViewedComment(commentId: string): void {
		this.unviewCommentReplies();
		this.deleteComment(commentId);
	}
}
