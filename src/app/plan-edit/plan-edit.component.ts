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
import { SaveButtonComponent } from '../components/save-button/save-button.component';
import { ScoreTableComponent } from '../components/score-table/score-table.component';
import { SelectDropdownComponent } from '../components/select-dropdown/select-dropdown.component';
import { PlanService } from '../services/plan.service';
import { ThemeService } from '../services/theme.service';
import { DropdownOption } from '../shared/models/dropdown-option';
import { PlanDetails } from '../shared/models/plan-details';
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
  ],
  templateUrl: './plan-edit.component.html',
  styleUrl: './plan-edit.component.scss',
})
export class PlanEditComponent implements OnInit {
  // url params
  protected planName = input<string>();

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
    })
  );
  protected planDetails = signal<PlanDetails>(new PlanDetails());
  protected scrollerOffset = signal<[number, number]>([0, 40]); // [x, y
  protected irTypeOptions = signal<DropdownOption[]>([
    {
      value: 'type1',
      display: 'Type 1',
    },
    {
      value: 'type2',
      display: 'Type 2',
    },
    {
      value: 'type3',
      display: 'Type 3',
    },
    {
      value: 'type4',
      display: 'Type 4',
    },
    {
      value: 'type5',
      display: 'Type 5',
    },
  ]);

  protected scoreTableData = computed(() => this.computedScoreTable());

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
        }
      });
  }

  getScoreFormGroup(): FormGroup {
    return this.form().get('score') as FormGroup;
  }

  computedScoreTable(): ScoreTableRow[] {
    const plans = this.planDetails();
    const res = plans.assessmentCriteria?.map((c) => {
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

    plans.assessmentScore?.forEach((row) => {
      // Only display score for current year and from the owner of the plan
      if (row.year === year && row.userRole === 'user') {
        res[row.criteriaOrder - 1].score = row.score;
      }
    });
    return res || [];
  }

  getControl(name: string): FormControl {
    return this.form().get(name) as FormControl;
  }

  onBackToPlanDetailsPage() {
    this.router.navigate([`/plan/${this.planName()}`]);
  }

  onReadinessSaveClick() {
    console.log('==onReadinessSaveClick form', this.form());
  }
  onAssessmentScoresSaveClick() {
    console.log('==onAssessmentScoresSaveClick form', this.form());
  }
  onWorkGoalSaveClick() {
    console.log('==onWorkGoalSaveClick form', this.form());
  }
}
