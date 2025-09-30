import { ChangeDetectionStrategy, Component, input } from "@angular/core";
import { Comment } from "../../../../core/models/domain/comment/comment";
import { TextAreaComponent } from "../../../../shared/components/inputs/text-area/text-area.component";
import { BaseFormComponent } from "../../../base-form-page/base-form-page.component";
import {
	FormBuilder,
	Validators,
	FormsModule,
	ReactiveFormsModule,
} from "@angular/forms";
import { CommonModule } from "@angular/common";
import { CommentDetailsComponent } from "./components/comment-details/comment-details.component";

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
	public commentsList = input.required<Array<Comment>>();

	constructor(private fb: FormBuilder) {
		super();

		this.setFormGroup(
			fb.group({
				comment: fb.control<string>(""),
			})
		);
	}

	protected get comment() {
		return this.formGroup.get("comment")!;
	}
}
