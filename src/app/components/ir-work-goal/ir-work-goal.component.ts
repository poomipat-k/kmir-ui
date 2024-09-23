import { CommonModule, TitleCasePipe } from '@angular/common';
import { Component, computed, input, signal } from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { DropdownOption } from '../../shared/models/dropdown-option';
import { PlanDetails } from '../../shared/models/plan-details';
import { SafeHtmlPipe } from '../../shared/pipe/safe-html.pipe';
import { CustomEditorComponent } from '../custom-editor/custom-editor.component';
import { IconTooltipComponent } from '../icon-tooltip/icon-tooltip.component';
import { SelectDropdownComponent } from '../select-dropdown/select-dropdown.component';
import { UpdatedAtComponent } from '../updated-at/updated-at.component';

@Component({
  selector: 'app-com-ir-work-goal',
  standalone: true,
  imports: [
    CommonModule,
    UpdatedAtComponent,
    SafeHtmlPipe,
    CustomEditorComponent,
    SelectDropdownComponent,
    IconTooltipComponent,
    TitleCasePipe,
  ],
  templateUrl: './ir-work-goal.component.html',
  styleUrl: './ir-work-goal.component.scss',
})
export class IrWorkGoalComponent {
  plans = input.required<PlanDetails[]>();
  editMode = input(false);
  formArray = input<FormArray>();

  activeIndex = signal(0);

  protected irWorkGoalTooltip = signal(
    `เป้าหมายการทำงานด้านต่างประเทศ ออกแบบมาเพื่อปรับกิจกรรมของแต่ละแผนให้สอดคล้องกับความพร้อมของการมีส่วนร่วม เพื่อสร้างรูปธรรมในการดำเนินการในขั้นต่อไป เป็นพื้นฐานสำหรับการพัฒนาแผนปฏิบัติการแต่ละแผน ซึ่งสามารถปรับเปลี่ยนตามผลลัพธ์ของการประเมินความพร้อม 

    ทั้งนี้ได้แบ่งระดับเป้าหมายออกเป็น 5 ระดับตามความคาดหวังต่อผลลัพธ์ดังนี้

ระดับ 1: ความต้องการนำกระบวนการ ความรู้และการเคลื่อนไหวด้านสุขภาพระดับโลกมาปรับใช้ในการดำเนินงานภายในของแผนงานของสสส. 
ระดับ 2: ความต้องการเผยแพร่ผลงานของสสส. (แนวปฏิบัติที่ดี กรณีศึกษา) บนเวทีระหว่างประเทศ 
ระดับ 3: ความต้องการเข้าร่วมเครือข่ายและพันธมิตรระดับภูมิภาคและระดับโลกที่เกี่ยวข้องกับขอบเขตงาน 
ระดับ 4: ความต้องการเป็นผู้นำการหารือ อภิปรายและผลักดันความเคลื่อนไหวในเครือข่ายและพันธมิตรระดับภูมิภาคและระดับโลกที่เกี่ยวข้องกับประเด็นและผลประโยชน์ของสสส. ระดับ 5: ความต้องการมีบทบาทในการกำหนดนโยบายสุขภาพโลกในระดับภูมิภาคและระดับโลกอย่างแข็งขัน รวมถึงการเข้าร่วมในเวทีระหว่างประเทศ
`
  );

  buttons = computed(() => {
    return this.plans().map((p) => p.name.replace('PLAN', 'P.'));
  });

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

  updatedText = computed(() => {
    const selectedPlan = this.plans()[this.activeIndex()];
    const who = selectedPlan.proposedActivityUpdatedBy;
    const date = new Date(selectedPlan.proposedActivityUpdatedAt ?? 0);
    const local = date.toLocaleString('en-GB', {
      hourCycle: 'h24',
      timeZone: 'Asia/bangkok',
    });
    return `latest edit by ${who} ${local}`;
  });

  getGoalDetailsFormControlAt(index: number) {
    return this.formArray()?.at(index)?.get('goalDetails') as FormControl;
  }

  getIrGoalFormGroupAt(index: number) {
    return this.formArray()?.at(index) as FormGroup;
  }

  onPlanButtonClick(index: number) {
    this.activeIndex.set(index);
  }

  getGoalTypeDisplay(raw?: string) {
    if (!raw) return '';
    return raw.split('_').join(' ');
  }
}
