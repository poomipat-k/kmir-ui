import { Component, computed, inject, input } from '@angular/core';
import { DateService } from '../../services/date.service';
import { LatestScore } from '../../shared/models/latest-score';
import { PlanDetails } from '../../shared/models/plan-details';

@Component({
  selector: 'app-com-change-log',
  standalone: true,
  imports: [],
  templateUrl: './change-log.component.html',
  styleUrl: './change-log.component.scss',
})
export class ChangeLogComponent {
  plans = input.required<PlanDetails[]>();
  latestScores = input.required<LatestScore[]>();

  // computed signals
  dateAndTimeList = computed(() => {
    return this.plans().map((p) => {
      if (!p.updatedAt) {
        return ['', ''];
      }
      const [date, time] = this.dateService.getDateAndTime(
        new Date(p.updatedAt)
      );
      return [date, time];
    });
  });

  editItemList = computed(() => this.computeEditItemList());

  private readonly dateService: DateService = inject(DateService);

  private computeEditItemList() {
    return this.plans().map((plan) => {
      const list = [];
      const ts1 = plan.updatedAt!;
      const ts2 = this.latestScores().find(
        (s) => s.planId === plan.planId
      )?.createdAt;

      let ts = ts1;
      if (ts2 && new Date(ts2) >= new Date(ts1)) {
        ts = ts2;
        list.push('assessment score');
      }

      if (plan.readinessWillingnessUpdatedAt === ts) {
        list.push('readiness');
      }
      if (plan.irGoalTypeUpdatedAt === ts) {
        list.push('ir work goal type');
      }
      if (plan.irGoalDetailsUpdatedAt === ts) {
        list.push('ir work goal type');
      }
      if (plan.proposedActivityUpdatedAt === ts) {
        list.push('proposed activity');
      }
      if (plan.planNoteUpdatedAt === ts) {
        list.push('plan note');
      }
      if (plan.contactPersonUpdatedAt === ts) {
        list.push('contact person');
      }
      if (plan.assessmentScore?.[0]?.createdAt === ts) {
        list.push('assessment score');
      }
      return list;
    });
  }
}
