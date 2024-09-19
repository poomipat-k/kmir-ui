import { Component, input } from '@angular/core';

@Component({
  selector: 'app-com-metric-score-summary',
  standalone: true,
  imports: [],
  templateUrl: './metric-score-summary.component.html',
  styleUrl: './metric-score-summary.component.scss',
})
export class MetricScoreSummaryComponent {
  maxHeight = input.required<string>();
}
