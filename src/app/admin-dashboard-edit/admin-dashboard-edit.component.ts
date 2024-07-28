import { Component, computed, inject, OnInit, signal } from '@angular/core';
import {
  FormArray,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { pick } from 'lodash-es';
import { AdminNoteComponent } from '../components/admin-note/admin-note.component';
import { IconTooltipComponent } from '../components/icon-tooltip/icon-tooltip.component';
import { PlanNoteComponent } from '../components/plan-note/plan-note.component';
import { ProposedActivitiesComponent } from '../components/proposed-activities/proposed-activities.component';
import { SaveAndReturnButtonComponent } from '../components/save-and-return-button/save-and-return-button.component';
import { SaveButtonComponent } from '../components/save-button/save-button.component';
import { ScoreTableAdminComponent } from '../components/score-table-admin/score-table-admin.component';
import { PlanService } from '../services/plan.service';
import { AssessmentCriteria } from '../shared/models/assessment-criteria';
import { PlanDetails } from '../shared/models/plan-details';
import { ScoreTableRow } from '../shared/models/score-table-row';

@Component({
  selector: 'app-admin-dashboard-edit',
  standalone: true,
  imports: [
    SaveButtonComponent,
    IconTooltipComponent,
    ScoreTableAdminComponent,
    ProposedActivitiesComponent,
    ReactiveFormsModule,
    PlanNoteComponent,
    AdminNoteComponent,
    SaveAndReturnButtonComponent,
  ],
  templateUrl: './admin-dashboard-edit.component.html',
  styleUrl: './admin-dashboard-edit.component.scss',
})
export class AdminDashboardEditComponent implements OnInit {
  private readonly router: Router = inject(Router);
  private readonly planService: PlanService = inject(PlanService);

  // signals
  protected plans = signal<PlanDetails[]>([]);
  protected criteriaList = signal<AssessmentCriteria[]>([]);
  protected adminNote = signal('');

  protected form = signal<FormGroup>(
    new FormGroup({
      assessmentScore: new FormArray([]),
      proposedActivity: new FormArray([]),
      planNote: new FormArray([]),
      adminNote: new FormControl(null),
    })
  );

  // Computed signals
  protected topicShortList = computed(() => this.computeTopicShortList());
  protected assessmentScoreData = computed(() => this.computeAssessmentData());

  ngOnInit(): void {
    this.planService.getAllPlansDetails().subscribe((res) => {
      console.log('==res', res);
      if (res?.assessmentCriteria?.length > 0) {
        this.criteriaList.set(res.assessmentCriteria);
      }
      if (res?.planDetails?.length > 0) {
        this.plans.set(res.planDetails);
      }
      this.adminNote.set(res.adminNote);
      this.initForm();
    });
  }

  private initForm() {
    const assessmentFormArray: FormGroup[] = [];
    const paFormArray: FormControl[] = [];
    const pnFormArray: FormControl[] = [];
    for (let i = 0; i < this.plans().length; i++) {
      const plan: PlanDetails = this.plans()[i];
      // scores
      assessmentFormArray.push(
        new FormGroup({
          q_1: new FormControl(
            plan?.assessmentScore?.[0]?.score,
            Validators.required
          ),
          q_2: new FormControl(
            plan?.assessmentScore?.[1]?.score,
            Validators.required
          ),
          q_3: new FormControl(
            plan?.assessmentScore?.[2]?.score,
            Validators.required
          ),
          q_4: new FormControl(
            plan?.assessmentScore?.[3]?.score,
            Validators.required
          ),
          q_5: new FormControl(
            plan?.assessmentScore?.[4]?.score,
            Validators.required
          ),
          q_6: new FormControl(
            plan?.assessmentScore?.[5]?.score,
            Validators.required
          ),
          q_7: new FormControl(
            plan?.assessmentScore?.[6]?.score,
            Validators.required
          ),
        })
      );

      // proposedActivity
      paFormArray.push(
        new FormControl(plan.proposedActivity, Validators.required)
      );

      // planNote
      pnFormArray.push(new FormControl(plan.planNote, Validators.required));
    }

    this.form.set(
      new FormGroup({
        assessmentScore: new FormArray(assessmentFormArray),
        proposedActivity: new FormArray(paFormArray),
        planNote: new FormArray(pnFormArray),
        adminNote: new FormControl(this.adminNote()),
      })
    );
  }

  onBackToDashboardPage() {
    this.router.navigate(['/admin/dashboard']);
  }

  onSave(name: string) {
    console.log('==onSave', name);
    console.log(this.form());
    let payload: any;
    if (name === 'full') {
      payload = this.form().value;
    } else if (name === 'assessmentScore') {
      payload = pick(this.form().value, 'assessmentScore');
    } else if (name === 'proposedActivity') {
      payload = pick(this.form().value, 'proposedActivity');
    } else if (name === 'planNote') {
      payload = pick(this.form().value, 'planNote');
    } else if (name === 'adminNote') {
      payload = pick(this.form().value, 'adminNote');
    }

    this.planService.adminEdit(payload).subscribe((result) => {
      console.log('==result', result);
    });
  }

  onSaveAndReturn() {
    // if (!this.validToSubmit()) {
    //   console.error('form is not valid');
    //   return;
    // }
    this.onSave('full');
  }

  getAssessmentScoreFormArray(): FormArray {
    return this.form().get('assessmentScore') as FormArray;
  }

  getProposedActivitiesFormArray(): FormArray {
    return this.form().get('proposedActivity') as FormArray;
  }

  getPlanNoteFormArray(): FormArray {
    return this.form().get('planNote') as FormArray;
  }

  getAdminNoteFormControl(): FormControl {
    return this.form().get('adminNote') as FormControl;
  }

  private computeTopicShortList(): string[] {
    const list = this.plans()?.map((p) => p.topicShort);
    return list;
  }

  private computeAssessmentData() {
    const plans = this.plans();
    const scoreData = plans?.map((plan) => {
      return (
        plan?.assessmentScore?.map(
          (s) => new ScoreTableRow(s.criteriaOrder, s.score)
        ) || []
      );
    });
    return scoreData || [];
  }
}
