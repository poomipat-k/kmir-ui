import { Component, input } from '@angular/core';
import { ScoreTableRow } from '../../shared/models/score-table-row';

@Component({
  selector: 'app-com-score-table',
  standalone: true,
  imports: [],
  templateUrl: './score-table.component.html',
  styleUrl: './score-table.component.scss',
})
export class ScoreTableComponent {
  data = input<ScoreTableRow[]>([]);
}
