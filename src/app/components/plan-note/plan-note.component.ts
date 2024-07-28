import { CommonModule, TitleCasePipe } from '@angular/common';
import { Component, computed, input, signal } from '@angular/core';
import { FormArray, FormControl } from '@angular/forms';
import { PlanDetails } from '../../shared/models/plan-details';
import { SafeHtmlPipe } from '../../shared/pipe/safe-html.pipe';
import { CustomEditorComponent } from '../custom-editor/custom-editor.component';
import { UpdatedAtComponent } from '../updated-at/updated-at.component';

@Component({
  selector: 'app-com-plan-note',
  standalone: true,
  imports: [
    CommonModule,
    UpdatedAtComponent,
    SafeHtmlPipe,
    TitleCasePipe,
    CustomEditorComponent,
  ],
  templateUrl: './plan-note.component.html',
  styleUrl: './plan-note.component.scss',
})
export class PlanNoteComponent {
  plans = input.required<PlanDetails[]>();
  editMode = input(false);
  formArray = input<FormArray>();

  activeIndex = signal(0);
  updatedText = computed(() => {
    const selectedPlan = this.plans()[this.activeIndex()];
    const who = selectedPlan.planNoteUpdatedBy;
    const date = new Date(selectedPlan.planNoteUpdatedAt ?? 0);
    const local = date.toLocaleString('en-GB', {
      hourCycle: 'h24',
      timeZone: 'Asia/bangkok',
    });
    return `latest edit by ${who} ${local}`;
  });

  buttons = computed(() => {
    return this.plans().map((p) => p.name.replace('PLAN', 'P.'));
  });

  onPlanButtonClick(index: number) {
    this.activeIndex.set(index);
  }

  getFormControl() {
    return this.formArray()?.at(this.activeIndex()) as FormControl;
  }
}
