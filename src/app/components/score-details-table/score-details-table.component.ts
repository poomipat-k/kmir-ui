import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { ScoreExplanationService } from '../../services/score-explanation.service';
import { MetricScoreMeaning } from '../../shared/models/metric-score-meaning';
import { SafeHtmlPipe } from '../../shared/pipe/safe-html.pipe';

@Component({
  selector: 'app-com-score-details-table',
  standalone: true,
  imports: [SafeHtmlPipe, CommonModule],
  templateUrl: './score-details-table.component.html',
  styleUrl: './score-details-table.component.scss',
})
export class ScoreDetailsTableComponent implements OnInit {
  zoneRanks = signal<MetricScoreMeaning[]>([]);

  scoreExplanationService: ScoreExplanationService = inject(
    ScoreExplanationService
  );

  ngOnInit(): void {
    const rankObject = this.scoreExplanationService.getScoreRank();
    const list = ['LL', 'LM', 'LH', 'ML', 'MM', 'MH', 'HL', 'HM', 'HH'];
    const rankList: MetricScoreMeaning[] = [];
    for (const key of list) {
      const item = rankObject[key];
      if (item) {
        rankList.push(item);
      }
    }
    this.zoneRanks.set(rankList);
  }
}
