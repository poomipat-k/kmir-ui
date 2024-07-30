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
  editItemList = computed(() => this.computeEditItemList());

  editByList = computed(() => {
    return this.plans().map((plan) => {
      if (!plan.updatedBy) {
        return '';
      }
      const ts1 = plan.updatedAt!;
      const latestScore = this.latestScores().find((s) => {
        return s.planId === plan.planId;
      });
      const ts2 = latestScore?.createdAt;

      let ts = ts1;
      if (ts2 && new Date(ts2) >= new Date(ts1)) {
        ts = ts2;
        return latestScore?.userRole;
      }
      return plan.updatedBy;
    });
  });

  dateAndTimeList = computed(() => {
    return this.plans().map((plan) => {
      if (!plan.updatedAt) {
        return ['', ''];
      }
      const ts1 = plan.updatedAt!;
      const ts2 = this.latestScores().find((s) => {
        return s.planId === plan.planId;
      })?.createdAt;

      let ts = ts1;
      if (ts2 && new Date(ts2) >= new Date(ts1)) {
        ts = ts2;
      }
      const [date, time] = this.dateService.getDateAndTime(new Date(ts));
      return [date, time];
    });
  });

  private readonly dateService: DateService = inject(DateService);

  private computeEditItemList() {
    return this.plans().map((plan) => {
      const list = [];
      const ts1 = plan.updatedAt!;
      const ts2 = this.latestScores().find((s) => {
        return s.planId === plan.planId;
      })?.createdAt;

      let ts = ts1;
      if (ts2 && new Date(ts2) >= new Date(ts1)) {
        ts = ts2;
      }

      if (plan.readinessWillingnessUpdatedAt === ts) {
        list.push('readiness');
      }
      if (plan.irGoalTypeUpdatedAt === ts) {
        list.push('irWorkGoalType');
      }
      if (plan.irGoalDetailsUpdatedAt === ts) {
        list.push('irWorkGoalDetails');
      }
      if (plan.proposedActivityUpdatedAt === ts) {
        list.push('proposedActivity');
      }
      if (plan.planNoteUpdatedAt === ts) {
        list.push('planNote');
      }
      if (plan.contactPersonUpdatedAt === ts) {
        list.push('contactPerson');
      }
      if (plan.assessmentScore?.[0]?.createdAt === ts) {
        list.push('assessmentScore');
      }
      return list.join(', ');
    });
  }
}
