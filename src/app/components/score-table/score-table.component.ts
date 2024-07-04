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
  data = input<ScoreTableRow[]>([
    {
      order: 1,
      question:
        "The plan’s international activities are well-aligned with the foundation's overall strategic objectives.",
      score: 7,
    },
    {
      order: 2,
      question:
        'The plan is highly aware of the benefits and importance of engaging in international activities.',
      score: 8,
    },
    {
      order: 3,
      question:
        'The plan feels strongly supported by the International Relations Section and Executives in pursuing international activities.',
      score: 8,
    },
    {
      order: 4,
      question:
        'The plan uses resources efficiently for international activities.',
      score: 7,
    },
    {
      order: 5,
      question:
        'The plan is highly competent in handling international affairs.',
      score: 10,
    },
    {
      order: 6,
      question:
        "The quality of the plan's past and existing international partnerships is excellent",
      score: 9,
    },
    {
      order: 7,
      question:
        'The plan effectively measures the outcomes of its international activities.',
      score: 8,
    },
  ]);
}
