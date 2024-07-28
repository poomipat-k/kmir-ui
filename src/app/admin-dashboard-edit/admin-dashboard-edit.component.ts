import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { IconTooltipComponent } from '../components/icon-tooltip/icon-tooltip.component';
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
      // if (res?.latestScores) {
      //   this.latestScores.set(res.latestScores);
      // }
      // this.adminNote.set(res.adminNote);
      this.initForm();
    });
  }

  private initForm() {
    const assessmentFormArray = this.plans().map(
      (_) =>
        new FormGroup({
          q_1: new FormControl(null, Validators.required),
          q_2: new FormControl(null, Validators.required),
          q_3: new FormControl(null, Validators.required),
          q_4: new FormControl(null, Validators.required),
          q_5: new FormControl(null, Validators.required),
          q_6: new FormControl(null, Validators.required),
          q_7: new FormControl(null, Validators.required),
        })
    );
    this.form.set(
      new FormGroup({
        assessmentScore: new FormArray(assessmentFormArray),
        proposedActivity: new FormArray([]),
        planNote: new FormArray([]),
        adminNote: new FormControl(null),
      })
    );
  }

  onBackToDashboardPage() {
    this.router.navigate(['/admin/dashboard']);
  }

  onSaveButtonClick(name: string) {
    console.log('==onSaveButtonClick', name);
    console.log(this.form());
  }

  getAssessmentScoreFormArray(): FormArray {
    return this.form().get('assessmentScore') as FormArray;
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
