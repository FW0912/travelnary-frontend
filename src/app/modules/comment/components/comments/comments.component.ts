import {
	ChangeDetectionStrategy,
	Component,
	input,
	output,
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

@Component({
	selector: "app-comments",
	imports: [
		TextAreaComponent,
		FormsModule,
		ReactiveFormsModule,
		CommonModule,
		CommentDetailsComponent,
	],
	templateUrl: "./comments.component.html",
	styleUrl: "./comments.component.css",
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CommentsComponent extends BaseFormComponent {
	public planId = input.required<string>();
	public commentsList = input.required<Array<GetCommentDto>>();

	public comment = output<GetCommentDto>();

	constructor(
		private fb: FormBuilder,
		private commentService: CommentService
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
				this.comment.emit(x.data);
			},
		});
	}
}
