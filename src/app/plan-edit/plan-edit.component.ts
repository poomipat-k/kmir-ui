import { ViewportScroller } from '@angular/common';
import {
  Component,
  OnInit,
  computed,
  inject,
  input,
  signal,
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';

import { CustomEditorComponent } from '../components/custom-editor/custom-editor.component';
import { IconTooltipComponent } from '../components/icon-tooltip/icon-tooltip.component';
import { PopupComponent } from '../components/popup/popup.component';
import { SaveAndReturnButtonComponent } from '../components/save-and-return-button/save-and-return-button.component';
import { SaveButtonComponent } from '../components/save-button/save-button.component';
import { ScoreTableComponent } from '../components/score-table/score-table.component';
import { SelectDropdownComponent } from '../components/select-dropdown/select-dropdown.component';
import { PlanService } from '../services/plan.service';
import { ThemeService } from '../services/theme.service';
import { DropdownOption } from '../shared/models/dropdown-option';
import { PlanDetails } from '../shared/models/plan-details';
import { PlanFormValue } from '../shared/models/plan-form-value';
import { ScoreTableRow } from '../shared/models/score-table-row';

@Component({
  selector: 'app-plan-edit',
  standalone: true,
  imports: [
    IconTooltipComponent,
    SaveButtonComponent,
    ReactiveFormsModule,
    CustomEditorComponent,
    ScoreTableComponent,
    SelectDropdownComponent,
    SaveAndReturnButtonComponent,
    PopupComponent,
  ],
  templateUrl: './plan-edit.component.html',
  styleUrl: './plan-edit.component.scss',
})
export class PlanEditComponent implements OnInit {
  // url params
  protected planName = input<string>('');

  protected form = signal<FormGroup>(
    new FormGroup({
      readinessWillingness: new FormControl(null, Validators.required),
      score: new FormGroup({
        q1: new FormControl(null, Validators.required),
        q2: new FormControl(null, Validators.required),
        q3: new FormControl(null, Validators.required),
        q4: new FormControl(null, Validators.required),
        q5: new FormControl(null, Validators.required),
        q6: new FormControl(null, Validators.required),
        q7: new FormControl(null, Validators.required),
      }),
      irGoalType: new FormControl(null, Validators.required),
      irGoalDetails: new FormControl(null, Validators.required),
      proposedActivity: new FormControl(null, Validators.required),
      planNote: new FormControl(null, Validators.required),
      contactPerson: new FormControl(null, Validators.required),
    })
  );

  protected showPopup = signal(false);
  protected isPopupError = signal(false);
  protected popupText = signal('Update plan successfully');
  protected originalForm = signal<PlanFormValue>(new PlanFormValue());
  protected planDetails = signal<PlanDetails>(new PlanDetails());
  protected scrollerOffset = signal<[number, number]>([0, 40]); // [x, y
  protected irTypeOptions = signal<DropdownOption[]>([
    {
      value: 'type_1',
      display: 'Type 1',
    },
    {
      value: 'type_2',
      display: 'Type 2',
    },
    {
      value: 'type_3',
      display: 'Type 3',
    },
    {
      value: 'type_4',
      display: 'Type 4',
    },
    {
      value: 'type_5',
      display: 'Type 5',
    },
  ]);

  protected scoreTableData = computed(() =>
    this.computedScoreTableAndRefreshForm()
  );

  protected readonly themeService: ThemeService = inject(ThemeService);
  private readonly planService: PlanService = inject(PlanService);
  private readonly router: Router = inject(Router);
  private readonly scroller: ViewportScroller = inject(ViewportScroller);

  ngOnInit(): void {
    this.themeService.changeTheme('silver');
    this.scroller.setOffset(this.scrollerOffset());
    this.planService
      .getPlanDetails(this.planName() || '')
      .subscribe((planDetails) => {
        console.log('==edit plan planDetails', planDetails);
        if (planDetails) {
          this.planDetails.set(planDetails);
          this.computedScoreTableAndRefreshForm();
          this.originalForm.set(this.form().value);
        }
      });
  }

  getScoreFormGroup(): FormGroup {
    return this.form().get('score') as FormGroup;
  }

  computedScoreTableAndRefreshForm(): ScoreTableRow[] {
    const plan = this.planDetails();
    const res = plan.assessmentCriteria?.map((c) => {
      const row = new ScoreTableRow();
      row.order = c.orderNumber;
      row.question = c.display;
      return row;
    });
    const now = new Date();
    const nowLocal = now.toLocaleDateString('en-GB', {
      timeZone: 'Asia/bangkok',
    });
    const split = nowLocal.split('/');
    const year = +split[split.length - 1];

    plan.assessmentScore?.forEach((row) => {
      // Only display score for current year and from the owner of the plan
      if (row.year === year && row.userRole === 'user') {
        res[row.criteriaOrder - 1].score = row.score;
      }
    });

    if (res) {
      res.sort((a, b) => {
        return a.order >= b.order ? 1 : -1;
      });
      this.form().patchValue({
        readinessWillingness: plan.readinessWillingness,
        irGoalType: plan.irGoalType,
        irGoalDetails: plan.irGoalDetails,
        proposedActivity: plan.proposedActivity,
        planNote: plan.planNote,
        contactPerson: plan.contactPerson,
        score: {
          q1: res[0].score,
          q2: res[1].score,
          q3: res[2].score,
          q4: res[3].score,
          q5: res[4].score,
          q6: res[5].score,
          q7: res[6].score,
        },
      });
    }
    return res || [];
  }

  getControl(name: string): FormControl {
    return this.form().get(name) as FormControl;
  }

  onBackToPlanDetailsPage() {
    this.router.navigate([`/plan/${this.planName()}`]);
  }

  onSaveButtonClick(name: string) {
    const newPlanValue = new PlanFormValue();
    if (name === 'full' || name === 'readinessWillingness') {
      const newValue: string = this.form().value.readinessWillingness;
      const diff = newValue !== this.originalForm().readinessWillingness;
      if (diff) {
        newPlanValue.readinessWillingness = newValue;
      }
    }

    if (name === 'full' || name === 'irGoal') {
      const newType: string = this.form().value.irGoalType;
      const typeDiff = newType !== this.originalForm().irGoalType;
      if (typeDiff) {
        newPlanValue.irGoalType = newType;
      }

      const newDetails: string = this.form().value.irGoalDetails;
      const detailsDiff = newDetails !== this.originalForm().irGoalDetails;
      if (detailsDiff) {
        newPlanValue.irGoalDetails = newDetails;
      }
    }

    if (name === 'full' || name === 'proposedActivity') {
      const newValue: string = this.form().value.proposedActivity;
      const diff = newValue !== this.originalForm().proposedActivity;
      if (diff) {
        newPlanValue.proposedActivity = newValue;
      }
    }

    if (name === 'full' || name === 'planNote') {
      const newValue: string = this.form().value.planNote;
      const diff = newValue !== this.originalForm().planNote;
      if (diff) {
        newPlanValue.planNote = newValue;
      }
    }

    if (name === 'full' || name === 'contactPerson') {
      const newValue: string = this.form().value.contactPerson;
      const diff = newValue !== this.originalForm().contactPerson;
      if (diff) {
        newPlanValue.contactPerson = newValue;
      }
    }

    console.log('==newPlanValue', newPlanValue);
    this.planService.editPlan(this.planName(), newPlanValue).subscribe({
      next: (res) => {
        if (res) {
          this.popupText.set('Update plan successfully');
          this.isPopupError.set(false);
          this.showPopup.set(true);
          console.log('==res', res);
          setTimeout(() => {
            this.showPopup.set(false);
            if (name === 'full') {
              this.router.navigate([`/plan/${this.planName()}`]);
            }
          }, 2000);
        }
      },
      error: (err) => {
        let message = '';
        if (err?.error?.name === 'no_changes') {
          message = 'No changes found.';
        } else {
          message = err?.error?.message;
        }
        this.isPopupError.set(true);
        this.popupText.set(message);
        this.showPopup.set(true);
        setTimeout(() => {
          this.showPopup.set(false);
        }, 2000);
      },
    });
  }

  onSaveAndReturn() {
    console.log('==onSaveAndReturn');
    this.onSaveButtonClick('full');
  }
}
