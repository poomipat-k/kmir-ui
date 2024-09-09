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

import { cloneDeep, isEqual } from 'lodash-es';
import { CustomEditorComponent } from '../components/custom-editor/custom-editor.component';
import { ErrorMessageComponent } from '../components/error-message/error-message.component';
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
    ErrorMessageComponent,
  ],
  templateUrl: './plan-edit.component.html',
  styleUrl: './plan-edit.component.scss',
})
export class PlanEditComponent implements OnInit {
  // url params
  protected planName = input<string>('');

  protected form = signal<FormGroup>(
    new FormGroup({
      assessmentScore: new FormGroup({
        q_1: new FormControl(null, Validators.required),
        q_2: new FormControl(null, Validators.required),
        q_3: new FormControl(null, Validators.required),
        q_4: new FormControl(null, Validators.required),
        q_5: new FormControl(null, Validators.required),
        q_6: new FormControl(null, Validators.required),
        q_7: new FormControl(null, Validators.required),
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
  protected scrollerOffset = signal<[number, number]>([0, 40]); // [x, y]
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
  protected readinessTooltipText = signal(
    'กรอบการประเมินความพร้อมด้านต่างประเทศอ้างอิงจากการทบทวนวรรณกรรมและปรับให้เหมาะสมกับบริบทงานต่างประเทศของ สสส. มุ่งเน้น 2 มิติหลัก ได้แก่ ความเต็มใจ (Willingness) และขีดความสามารถ (Capacity) ของแผนงานหรือสำนักต่างๆในการมีส่วนร่วมในการดำเนินงานด้านต่างประเทศอย่างมีประสิทธิผล การแปรผลแบบเมทริกซ์ เหมาะแก่การใช้ประโยชน์ด้านการตัดสินใจเชิงกลยุทธ์ภายใน สสส.'
  );
  protected assessmentScoreTooltip = signal(
    `แบบสอบถามดัชนีความพร้อมด้านต่างประเทศเกิดจากการทบทวนและทดลองนำร่อง ประกอบด้วย 7 ข้อคำถาม จากการประเมินทั้ง 2 มุมมองเพื่อให้ได้ภาพรวมที่ครอบคลุมเกี่ยวกับความพร้อมของแต่ละสำนัก/แผน ได้แก่

1. การประเมินจากภายนอกจากฝ่ายวิเทศสัมพันธ์ (สำนักพัฒนาภาคีสัมพันธ์และวิเทศสัมพันธ์) ชุดคำถามนี้จะได้รับการออกแบบมาเพื่อประเมินความพร้อมของสำนัก/แผน จากมุมมองภายนอกอย่างเป็นรูปธรรม โดยจะมุ่งเน้นไปที่วิธีที่สำนัก/แผนจัดการไปสู่ความสอดคล้องกับวัตถุประสงค์เชิงกลยุทธ์ การใช้ทรัพยากร และประสิทธิผลโดยรวมในการมีส่วนร่วมกับกิจกรรมที่เกี่ยวข้องกับงานด้านต่างประเทศ

2. การประเมินตนเองภายในโดยสำนัก/แผน ชุดคำถามนี้จะช่วยให้สำนัก/แผนดำเนินการประเมินตนเองด้านความพร้อมในการดำเนินงานด้านต่างประเทศ มุมมองนี้มีความสำคัญอย่างยิ่งสำหรับกระบวนการทำความเข้าใจภายในตนเอง การประเมินศักยภาพภายในและทีมฝ่ายวิเทศสัมพันธ์ และชี้แนวทางการพัฒนาในอนาคต
`
  );
  protected irWorkGoalTooltip = signal(
    `เป้าหมายการทำงานด้านต่างประเทศ ออกแบบมาเพื่อปรับกิจกรรมของแต่ละแผนให้สอดคล้องกับความพร้อมของการมีส่วนร่วม เพื่อสร้างรูปธรรมในการดำเนินการในขั้นต่อไป เป็นพื้นฐานสำหรับการพัฒนาแผนปฏิบัติการแต่ละแผน ซึ่งสามารถปรับเปลี่ยนตามผลลัพธ์ของการประเมินความพร้อม 

    ทั้งนี้ได้แบ่งระดับเป้าหมายออกเป็น 5 ระดับตามความคาดหวังต่อผลลัพธ์ดังนี้

ระดับ 1: ความต้องการนำกระบวนการ ความรู้และการเคลื่อนไหวด้านสุขภาพระดับโลกมาปรับใช้ในการดำเนินงานภายในของแผนงานของสสส. 
ระดับ 2: ความต้องการเผยแพร่ผลงานของสสส. (แนวปฏิบัติที่ดี กรณีศึกษา) บนเวทีระหว่างประเทศ 
ระดับ 3: ความต้องการเข้าร่วมเครือข่ายและพันธมิตรระดับภูมิภาคและระดับโลกที่เกี่ยวข้องกับขอบเขตงาน 
ระดับ 4: ความต้องการเป็นผู้นำการหารือ อภิปรายและผลักดันความเคลื่อนไหวในเครือข่ายและพันธมิตรระดับภูมิภาคและระดับโลกที่เกี่ยวข้องกับประเด็นและผลประโยชน์ของสสส. ระดับ 5: ความต้องการมีบทบาทในการกำหนดนโยบายสุขภาพโลกในระดับภูมิภาคและระดับโลกอย่างแข็งขัน รวมถึงการเข้าร่วมในเวทีระหว่างประเทศ
`
  );

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
        if (planDetails) {
          this.planDetails.set(planDetails);
          this.computedScoreTableAndRefreshForm();
          this.originalForm.set(this.form().value);
        }
      });
  }

  getAssessmentScoreFormGroup(): FormGroup {
    return this.form().get('assessmentScore') as FormGroup;
  }

  computedScoreTableAndRefreshForm(): ScoreTableRow[] {
    const plan = this.planDetails();
    const scoreData = plan.assessmentCriteria?.map(
      (c) => new ScoreTableRow(c.orderNumber, undefined, c.display)
    );
    const now = new Date();
    const nowLocal = now.toLocaleDateString('en-GB', {
      timeZone: 'Asia/bangkok',
    });
    const split = nowLocal.split('/');
    const year = +split[split.length - 1];

    plan.assessmentScore?.forEach((row) => {
      // Only display score for current year and from the owner of the plan
      if (row.year === year && row.userRole === 'user') {
        scoreData[row.criteriaOrder - 1].score = row.score;
      }
    });

    if (scoreData) {
      scoreData.sort((a, b) => {
        return a.order >= b.order ? 1 : -1;
      });
      this.form().patchValue({
        irGoalType: plan.irGoalType,
        irGoalDetails: plan.irGoalDetails,
        proposedActivity: plan.proposedActivity,
        planNote: plan.planNote,
        contactPerson: plan.contactPerson,
        assessmentScore: {
          q_1: scoreData[0].score,
          q_2: scoreData[1].score,
          q_3: scoreData[2].score,
          q_4: scoreData[3].score,
          q_5: scoreData[4].score,
          q_6: scoreData[5].score,
          q_7: scoreData[6].score,
        },
      });
    }
    return scoreData || [];
  }

  getControl(name: string): FormControl {
    return this.form().get(name) as FormControl;
  }

  onBackToPlanDetailsPage() {
    this.router.navigate([`/plan/${this.planName()}`]);
  }

  onSaveButtonClick(name: string) {
    const newPlanValue = new PlanFormValue();

    if (name === 'full' || name === 'assessmentScore') {
      const newValue = this.form().value.assessmentScore;
      const diff = !isEqual(newValue, this.originalForm().assessmentScore);
      if (diff) {
        newPlanValue.assessmentScore = newValue;
      }
      this.getControl('assessmentScore').markAllAsTouched();
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
      this.getControl('irGoalType').markAsTouched({ onlySelf: true });
      this.getControl('irGoalDetails').markAsTouched({ onlySelf: true });
    }

    if (name === 'full' || name === 'proposedActivity') {
      const newValue: string = this.form().value.proposedActivity;
      const diff = newValue !== this.originalForm().proposedActivity;
      if (diff) {
        newPlanValue.proposedActivity = newValue;
      }
      this.getControl('proposedActivity').markAsTouched({ onlySelf: true });
    }

    if (name === 'full' || name === 'planNote') {
      const newValue: string = this.form().value.planNote;
      const diff = newValue !== this.originalForm().planNote;
      if (diff) {
        newPlanValue.planNote = newValue;
      }
      this.getControl('planNote').markAsTouched({ onlySelf: true });
    }

    if (name === 'full' || name === 'contactPerson') {
      const newValue: string = this.form().value.contactPerson;
      const diff = newValue !== this.originalForm().contactPerson;
      if (diff) {
        newPlanValue.contactPerson = newValue;
      }
      this.getControl('contactPerson').markAsTouched({ onlySelf: true });
    }

    this.planService.editPlan(this.planName(), newPlanValue).subscribe({
      next: (res) => {
        if (res) {
          this.popupText.set('Update plan successfully');
          this.isPopupError.set(false);
          this.showPopup.set(true);
          this.originalForm.update((oldValue: PlanFormValue) => {
            const updateValue = cloneDeep(oldValue);
            if (newPlanValue.assessmentScore) {
              updateValue.assessmentScore = newPlanValue.assessmentScore;
            }
            if (newPlanValue.irGoalType) {
              updateValue.irGoalType = newPlanValue.irGoalType;
            }
            if (newPlanValue.irGoalDetails) {
              updateValue.irGoalDetails = newPlanValue.irGoalDetails;
            }
            if (newPlanValue.proposedActivity) {
              updateValue.proposedActivity = newPlanValue.proposedActivity;
            }
            if (newPlanValue.planNote) {
              updateValue.planNote = newPlanValue.planNote;
            }
            if (newPlanValue.contactPerson) {
              updateValue.contactPerson = newPlanValue.contactPerson;
            }
            return updateValue;
          });
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
          message = 'ไม่พบการเปลี่ยนแปลงข้อมูล';
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
    if (!this.validToSubmit()) {
      console.error('form is not valid');
      return;
    }
    this.onSaveButtonClick('full');
  }

  private validToSubmit(): boolean {
    if (!this.isFormValid()) {
      this.markFieldsTouched();
      return false;
    }
    return true;
  }

  private isFormValid(): boolean {
    return this.form()?.valid ?? false;
  }

  private markFieldsTouched() {
    const formGroup = this.form();
    if (formGroup) {
      formGroup.markAllAsTouched();
    }

    const errorId = this.getFirstErrorIdWithPrefix(formGroup, '');
    console.error('errorId:', errorId);
    if (errorId) {
      if (errorId.includes('assessmentScore')) {
        this.scrollToId('assessmentScore');
        return;
      }
      this.scrollToId(errorId);
    }
  }

  private getFirstErrorIdWithPrefix(
    rootGroup: FormGroup,
    prefix: string
  ): string {
    const keys = Object.keys(rootGroup.controls);
    for (const k of keys) {
      if ((rootGroup.controls[k] as FormGroup)?.controls) {
        const val = this.getFirstErrorIdWithPrefix(
          rootGroup.controls[k] as FormGroup,
          prefix ? `${prefix}.${k}` : k
        );
        if (val) {
          return val;
        }
      }
      if (!rootGroup.controls[k].valid) {
        return prefix ? `${prefix}.${k}` : k;
      }
    }
    return '';
  }

  private scrollToId(id: string) {
    this.scroller.setOffset([0, 100]);
    this.scroller.scrollToAnchor(id);
  }
}
