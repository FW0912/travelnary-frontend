import {
	ChangeDetectionStrategy,
	Component,
	Inject,
	signal,
} from "@angular/core";
import { BasePopupComponent } from "../../../base-popup/base-popup.component";
import {
	MAT_DIALOG_DATA,
	MatDialogActions,
	MatDialogContent,
} from "@angular/material/dialog";
import { BaseFormComponent } from "../../../base-form-page/base-form-page.component";
import { FormBuilder, ReactiveFormsModule } from "@angular/forms";
import { DropdownComponent } from "../../../../shared/components/dropdowns/dropdown/dropdown.component";
import { IValueOption } from "../../../../shared/models/utils/value-option";
import { AccessCategory } from "../../../../shared/enums/access-category";
import { GeneralUtils } from "../../../../shared/utils/general-utils";
import { ButtonComponent } from "../../../../shared/components/buttons/button/button.component";
import { SnackbarService } from "../../../../core/services/snackbar/snackbar.service";
import { ESnackbarType } from "../../../../core/models/utils/others/snackbar-type.enum";

@Component({
	selector: "app-share-plan-popup",
	imports: [
		BasePopupComponent,
		MatDialogContent,
		MatDialogActions,
		DropdownComponent,
		ButtonComponent,
	],
	templateUrl: "./share-plan-popup.component.html",
	styleUrl: "./share-plan-popup.component.css",
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SharePlanPopupComponent {
	protected ACCESS_CATEGORY_LIST: Array<IValueOption> = new Array();
	private selectedAccessCategory: string | null = null;

	constructor(
		@Inject(MAT_DIALOG_DATA)
		private data: {
			isOwner?: boolean;
		},
		private snackbarService: SnackbarService
	) {
		if (data.isOwner) {
			this.ACCESS_CATEGORY_LIST =
				GeneralUtils.getOptionList(AccessCategory);
		} else {
			this.ACCESS_CATEGORY_LIST = new Array({
				id: "1",
				value: AccessCategory.VIEWER,
			});
		}
	}

	protected onAccessCategorySelected(option: IValueOption) {
		this.selectedAccessCategory = option.value;
	}

	protected copyLink(): void {
		if (this.selectedAccessCategory === null) {
			this.snackbarService.openSnackBar(
				"Must select an Access Category!",
				ESnackbarType.ERROR
			);
			return;
		}

		console.log(this.selectedAccessCategory);
		this.snackbarService.openSnackBar("Copied link.", ESnackbarType.INFO);
	}
}
