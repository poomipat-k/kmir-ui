import { Component, computed, inject, input } from '@angular/core';
import { groupBy } from 'lodash-es';

import { ScoreExplanationService } from '../../services/score-explanation.service';
import { MetricInput } from '../../shared/models/metric-input';
import { MetricScoreMeaningData } from '../../shared/models/metric-score-meaning-data';

@Component({
  selector: 'app-com-metric-score-summary',
  standalone: true,
  imports: [],
  templateUrl: './metric-score-summary.component.html',
  styleUrl: './metric-score-summary.component.scss',
})
export class MetricScoreSummaryComponent {
  height = input.required<string>();
  data = input.required<MetricInput[]>();
  scoreExplanationService: ScoreExplanationService = inject(
    ScoreExplanationService
  );

  genPlansText(groups: MetricInput[]) {
    return groups.map((g) => `${g.name} (${g.year})`).join(', ');
  }

  groupData = computed(() => {
    const items = groupBy(this.data(), (item) => {
      // x and y can be L M H so eg. LL LM MH HH
      let label: string = '';
      if (item.y > 6) {
        label += 'H';
      } else if (item.y > 3) {
        label += 'M';
      } else {
        label += 'L';
      }

      if (item.x > 6) {
        label += 'H';
      } else if (item.x > 3) {
        label += 'M';
      } else {
        label += 'L';
      }

      return label;
    });
    for (const [k, v] of Object.entries(items)) {
      v.sort((a: MetricInput, b: MetricInput) => {
        if (a.name > b.name) {
          return 1;
        } else if (a.name < b.name) {
          return -1;
        }
        if (a.year > b.year) {
          return -1;
        } else if (a.year < b.year) {
          return 1;
        }
        return 0;
      });
      items[k] = v;
    }
    const data: MetricScoreMeaningData[] = [];
    const zoneRank = this.scoreExplanationService.getScoreRank();

    for (const [k, v] of Object.entries(zoneRank)) {
      if (items[k]) {
        const elem = new MetricScoreMeaningData();
        elem.list = items[k];
        elem.meaning = v;
        data.unshift(elem);
      }
    }
    return data;
  });
}
