import { CommonModule } from '@angular/common';
import { Component, input, signal } from '@angular/core';
import { FormArray, FormGroup } from '@angular/forms';
import { TooltipDirective } from '../../shared/directives/tooltip.directive';
import { AssessmentCriteria } from '../../shared/models/assessment-criteria';
import { DropdownOption } from '../../shared/models/dropdown-option';
import { ScoreTableRow } from '../../shared/models/score-table-row';
import { SafeHtmlPipe } from '../../shared/pipe/safe-html.pipe';
import { SelectDropdownComponent } from '../select-dropdown/select-dropdown.component';

@Component({
  selector: 'app-com-score-table-admin',
  standalone: true,
  imports: [
    SelectDropdownComponent,
    TooltipDirective,
    CommonModule,
    SelectDropdownComponent,
    SafeHtmlPipe,
  ],
  templateUrl: './score-table-admin.component.html',
  styleUrl: './score-table-admin.component.scss',
})
export class ScoreTableAdminComponent {
  shortNames = input<string[]>([]);
  criteria = input<AssessmentCriteria[]>([]);
  data = input<ScoreTableRow[][]>();
  unHighlightSet = input<Set<number>>();
  editMode = input(false);
  formArray = input<FormArray>();

  protected scoreOptions = signal<DropdownOption[]>([
    {
      display: 1,
      value: 1,
    },
    {
      display: 2,
      value: 2,
    },
    {
      display: 3,
      value: 3,
    },
    {
      display: 4,
      value: 4,
    },
    {
      display: 5,
      value: 5,
    },
    {
      display: 6,
      value: 6,
    },
    {
      display: 7,
      value: 7,
    },
    {
      display: 8,
      value: 8,
    },
    {
      display: 9,
      value: 9,
    },
    {
      display: 10,
      value: 10,
    },
  ]);

  getPlanText(index: number) {
    const num = index >= 12 ? index + 2 : index + 1;
    return `P.${num}`;
  }

  getCriteriaText(c: AssessmentCriteria) {
    return c.orderNumber + '. ' + c.display;
  }

  getFormGroup(index: number) {
    return this.formArray()?.at(index) as FormGroup;
  }
}
