import { ViewportScroller } from '@angular/common';
import {
  Component,
  computed,
  inject,
  OnInit,
  signal,
  viewChild,
} from '@angular/core';
import {
  FormArray,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { pick } from 'lodash-es';
import { environment } from '../../environments/environment';
import { AdminNoteComponent } from '../components/admin-note/admin-note.component';
import { ErrorMessageComponent } from '../components/error-message/error-message.component';
import { IconTooltipComponent } from '../components/icon-tooltip/icon-tooltip.component';
import { InstructionNoteComponent } from '../components/instruction-note/instruction-note.component';
import { PlanNoteComponent } from '../components/plan-note/plan-note.component';
import { PopupComponent } from '../components/popup/popup.component';
import { ProposedActivitiesComponent } from '../components/proposed-activities/proposed-activities.component';
import { SaveAndReturnButtonComponent } from '../components/save-and-return-button/save-and-return-button.component';
import { SaveButtonComponent } from '../components/save-button/save-button.component';
import { ScoreTableAdminComponent } from '../components/score-table-admin/score-table-admin.component';
import { PlanService } from '../services/plan.service';
import { ThemeService } from '../services/theme.service';
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
    PopupComponent,
    ErrorMessageComponent,
    InstructionNoteComponent,
  ],
  templateUrl: './admin-dashboard-edit.component.html',
  styleUrl: './admin-dashboard-edit.component.scss',
})
export class AdminDashboardEditComponent implements OnInit {
  proposedActivityComponent =
    viewChild<ProposedActivitiesComponent>('proposedActivity');
  planNoteComponent = viewChild<PlanNoteComponent>('planNote');

  private readonly router: Router = inject(Router);
  private readonly planService: PlanService = inject(PlanService);
  private readonly themeService: ThemeService = inject(ThemeService);
  private readonly scroller: ViewportScroller = inject(ViewportScroller);
  protected isProduction = signal(environment.production);

  // signals
  protected plans = signal<PlanDetails[]>([]);
  protected criteriaList = signal<AssessmentCriteria[]>([]);
  protected adminNote = signal('');
  protected showPopup = signal(false);
  protected isPopupError = signal(false);
  protected popupText = signal('Update successfully');
  protected scrollerOffset = signal<[number, number]>([0, 0]); // [x, y]
  protected assessmentScoreSubmitted = signal(false);
  protected proposedActivitySubmitted = signal(false);
  protected planNoteSubmitted = signal(false);
  protected adminNoteSubmitted = signal(false);
  protected proposedActivityErrorMsg = signal('กรุณากรอก Proposed activity');
  protected planNoteErrorMsg = signal('กรุณากรอก Note of Plan');
  protected assessmentScoreTooltip = signal(
    `แบบสอบถามดัชนีความพร้อมด้านต่างประเทศเกิดจากการทบทวนและทดลองนำร่อง ประกอบด้วย 7 ข้อคำถาม จากการประเมินทั้ง 2 มุมมองเพื่อให้ได้ภาพรวมที่ครอบคลุมเกี่ยวกับความพร้อมของแต่ละสำนัก/แผน ได้แก่

1. การประเมินจากภายนอกจากฝ่ายวิเทศสัมพันธ์ (สำนักพัฒนาภาคีสัมพันธ์และวิเทศสัมพันธ์) ชุดคำถามนี้จะได้รับการออกแบบมาเพื่อประเมินความพร้อมของสำนัก/แผน จากมุมมองภายนอกอย่างเป็นรูปธรรม โดยจะมุ่งเน้นไปที่วิธีที่สำนัก/แผนจัดการไปสู่ความสอดคล้องกับวัตถุประสงค์เชิงกลยุทธ์ การใช้ทรัพยากร และประสิทธิผลโดยรวมในการมีส่วนร่วมกับกิจกรรมที่เกี่ยวข้องกับงานด้านต่างประเทศ

2. การประเมินตนเองภายในโดยสำนัก/แผน ชุดคำถามนี้จะช่วยให้สำนัก/แผนดำเนินการประเมินตนเองด้านความพร้อมในการดำเนินงานด้านต่างประเทศ มุมมองนี้มีความสำคัญอย่างยิ่งสำหรับกระบวนการทำความเข้าใจภายในตนเอง การประเมินศักยภาพภายในและทีมฝ่ายวิเทศสัมพันธ์ และชี้แนวทางการพัฒนาในอนาคต
`
  );

  protected form = signal<FormGroup>(
    new FormGroup({
      assessmentScore: new FormArray([]),
      proposedActivity: new FormArray([]),
      planNote: new FormArray([]),
      adminNote: new FormControl(null, Validators.required),
    })
  );

  // Computed signals
  protected topicShortList = computed(() => this.computeTopicShortList());
  protected assessmentScoreData = computed(() => this.computeAssessmentData());

  ngOnInit(): void {
    this.themeService.changeTheme('silver');
    this.scroller.setOffset(this.scrollerOffset());

    this.planService.getAllPlansDetails().subscribe((res) => {
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
        adminNote: new FormControl(this.adminNote(), Validators.required),
      })
    );
  }

  onBackToDashboardPage() {
    this.router.navigate(['/admin/dashboard']);
  }

  onPatchScores() {
    const formArray = this.form().get('assessmentScore') as FormArray;
    formArray.controls.forEach((fg) => {
      fg.patchValue({
        q_1: 8,
        q_2: 8,
        q_3: 8,
        q_4: 8,
        q_5: 8,
        q_6: 8,
        q_7: 8,
      });
    });
  }

  private validToSubmit(name: string): boolean {
    if (name === 'full') {
      if (!this.form()?.valid) {
        this.markAllFieldsTouched();
        return false;
      }
      return true;
    }
    if (!this.form()?.get(name)?.valid) {
      this.markFieldsTouched(name);
      return false;
    }
    return true;
  }

  private markAllFieldsTouched() {
    const formGroup = this.form();
    if (formGroup) {
      formGroup.markAllAsTouched();
    }

    let errorId = '';
    const fields = [
      'assessmentScore',
      'proposedActivity',
      'planNote',
      'adminNote',
    ];

    for (const f of fields) {
      if (!this.form()?.get(f)?.valid) {
        errorId = f;
        break;
      }
    }
    console.error('errorId:', errorId);
    if (errorId) {
      this.navigateToErrorPlan(errorId);
      this.scrollToId(errorId);
    }
  }

  private markFieldsTouched(name: string) {
    const arrayOrGroup = this.form().get(name);
    if (arrayOrGroup) {
      arrayOrGroup.markAllAsTouched();
    }

    const errorId = name;
    console.error('errorId:', errorId);
    if (errorId) {
      this.navigateToErrorPlan(errorId);
      this.scrollToId(errorId);
    }
  }

  private navigateToErrorPlan(errorId: string) {
    if (errorId === 'proposedActivity') {
      const formArray = this.form().get(errorId) as FormArray;
      for (let i = 0; i < formArray.length; i++) {
        if (!formArray.at(i).valid) {
          const newErrMsg = `กรุณากรอก Proposed activity: ${
            this.plans()[i].name
          }`;
          this.proposedActivityErrorMsg.set(newErrMsg);
          this.proposedActivityComponent()?.activeIndex?.set(i);
          return;
        }
      }
    }

    if (errorId === 'planNote') {
      const formArray = this.form().get(errorId) as FormArray;
      for (let i = 0; i < formArray.length; i++) {
        if (!formArray.at(i).valid) {
          const newErrMsg = `กรุณากรอก Note of Plan: ${this.plans()[i].name}`;
          this.planNoteErrorMsg.set(newErrMsg);
          this.planNoteComponent()?.activeIndex?.set(i);
          return;
        }
      }
    }
  }

  private scrollToId(id: string) {
    this.scroller.setOffset([0, 100]);
    this.scroller.scrollToAnchor(id);
  }

  onSave(name: string) {
    let payload: any;
    if (name === 'full') {
      this.assessmentScoreSubmitted.set(true);
      this.proposedActivitySubmitted.set(true);
      this.planNoteSubmitted.set(true);
      this.adminNoteSubmitted.set(true);
      payload = this.form().value;
    } else if (name === 'assessmentScore') {
      this.assessmentScoreSubmitted.set(true);
      payload = pick(this.form().value, 'assessmentScore');
    } else if (name === 'irWorkGoal') {
      console.log('===onSave ', name);
    } else if (name === 'proposedActivity') {
      this.proposedActivitySubmitted.set(true);
      payload = pick(this.form().value, 'proposedActivity');
    } else if (name === 'planNote') {
      this.planNoteSubmitted.set(true);
      payload = pick(this.form().value, 'planNote');
    } else if (name === 'adminNote') {
      this.adminNoteSubmitted.set(true);
      payload = pick(this.form().value, 'adminNote');
    }
    if (!this.validToSubmit(name)) {
      return;
    }

    this.planService.adminEdit(payload).subscribe({
      next: (res) => {
        if (res.success) {
          this.popupText.set('แก้ไขข้อมูลสำเร็จ');
          this.isPopupError.set(false);
          this.showPopup.set(true);
          setTimeout(() => {
            this.showPopup.set(false);
            if (name === 'full') {
              this.router.navigate(['/admin/dashboard']);
            }
          }, 2000);
        } else {
          this.popupText.set('ไม่มีการเปลี่ยนแปลงของข้อมูล');
          this.isPopupError.set(false);
          this.showPopup.set(true);
          setTimeout(() => {
            this.showPopup.set(false);
          }, 2000);
        }
      },
      error: (err) => {
        this.popupText.set(
          `แก้ไขข้อมูลไม่สำเร็จ\nmessage: ${err?.error?.message}\nname: ${err?.error?.name}`
        );
        this.isPopupError.set(true);
        this.showPopup.set(true);
        setTimeout(() => {
          this.showPopup.set(false);
        }, 2000);
      },
    });
  }

  onSaveAndReturn() {
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
    return scoreData;
  }
}
