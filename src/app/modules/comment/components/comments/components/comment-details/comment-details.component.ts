import {
	ChangeDetectionStrategy,
	Component,
	effect,
	input,
	signal,
} from "@angular/core";
import { Comment } from "../../../../../../core/models/domain/comment/comment";
import { CommonModule, DatePipe } from "@angular/common";
import { TimeAgoPipe } from "../../../../../../shared/pipes/time-ago/time-ago.pipe";
import { TextAreaComponent } from "../../../../../../shared/components/inputs/text-area/text-area.component";
import { FormBuilder, FormControl, ReactiveFormsModule } from "@angular/forms";
import { BaseFormComponent } from "../../../../../base-form-page/base-form-page.component";
import { MatDialog } from "@angular/material/dialog";
import { ConfirmationPopupComponent } from "../../../../../confirmation-popup/confirmation-popup.component";
import { GetCommentDto } from "../../../../models/get-comment-dto";

@Component({
	selector: "app-comment-details",
	imports: [
		TimeAgoPipe,
		CommonModule,
		TextAreaComponent,
		ReactiveFormsModule,
	],
	templateUrl: "./comment-details.component.html",
	styleUrl: "./comment-details.component.css",
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CommentDetailsComponent extends BaseFormComponent {
	public comment = input.required<GetCommentDto>();
	protected isEditOpen = signal<boolean>(false);
	protected isReplyOpen = signal<boolean>(false);

	constructor(private fb: FormBuilder, private dialog: MatDialog) {
		super();

		this.setFormGroup(
			fb.group({
				content: fb.control<string>(""),
				reply: fb.control<string>(""),
			})
		);
	}

	protected get content() {
		return this.formGroup.get("content")!;
	}

	protected get reply() {
		return this.formGroup.get("reply")!;
	}

	protected onLike(): void {}

	protected openDeletePopup(): void {
		const ref = this.dialog.open(ConfirmationPopupComponent, {
			minWidth: "35%",
		});

		ref.afterClosed().subscribe((x) => console.log(x));
	}

	protected onEdit(): void {
		this.content.patchValue(this.comment().content);
		this.isEditOpen.set(true);
	}

	protected cancelEdit(): void {
		this.content.patchValue(this.comment().content);
		this.isEditOpen.set(false);
	}

	protected onReply(): void {
		this.isReplyOpen.set(true);
	}

	protected cancelReply(): void {
		this.isReplyOpen.set(false);
	}

	protected onPostReply(): void {}
}
