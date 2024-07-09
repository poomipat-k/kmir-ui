import { Component, input, signal } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { DropdownOption } from '../../shared/models/dropdown-option';
import { ScoreTableRow } from '../../shared/models/score-table-row';
import { SelectDropdownComponent } from '../select-dropdown/select-dropdown.component';

@Component({
  selector: 'app-com-score-table',
  standalone: true,
  imports: [SelectDropdownComponent],
  templateUrl: './score-table.component.html',
  styleUrl: './score-table.component.scss',
})
export class ScoreTableComponent {
  data = input<ScoreTableRow[]>([]);
  editMode = input(false);
  form = input<FormGroup>(new FormGroup({}));

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

  getDropdownControlName(item: ScoreTableRow): string {
    return `q_${item.order}`;
  }
}
