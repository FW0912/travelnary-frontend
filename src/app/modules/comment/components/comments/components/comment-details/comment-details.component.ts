import { ChangeDetectionStrategy, Component, input } from "@angular/core";
import { Comment } from "../../../../../../core/models/domain/comment/comment";
import { CommonModule, DatePipe } from "@angular/common";
import { TimeAgoPipe } from "../../../../../../shared/pipes/time-ago/time-ago.pipe";

@Component({
	selector: "app-comment-details",
	imports: [TimeAgoPipe, CommonModule],
	templateUrl: "./comment-details.component.html",
	styleUrl: "./comment-details.component.css",
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CommentDetailsComponent {
	public comment = input.required<Comment>();
}
