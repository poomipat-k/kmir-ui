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

  dateAndTimeList = computed(() => {
    console.log('==[dateAndTimeList]');
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

  private readonly dateService: DateService = inject(DateService);

  getEditedItemList(plan: PlanDetails): string[] {
    const list = [];
    const ts1 = plan.updatedAt;

    if (plan.readinessWillingnessUpdatedAt === ts1) {
      list.push('readiness');
    }
    if (plan.irGoalTypeUpdatedAt === ts1) {
      list.push('ir work goal type');
    }
    if (plan.irGoalDetailsUpdatedAt === ts1) {
      list.push('ir work goal type');
    }
    if (plan.proposedActivityUpdatedAt === ts1) {
      list.push('proposed activity');
    }
    if (plan.planNoteUpdatedAt === ts1) {
      list.push('plan note');
    }
    if (plan.contactPersonUpdatedAt === ts1) {
      list.push('contact person');
    }
    if (plan.assessmentScore?.[0]?.createdAt === ts1) {
      list.push('assessment score');
    }
    return list;
  }

  // getDateAndTime(dateStr: string) {
  //   if (!dateStr) {
  //     return '';
  //   }
  //   const [date, time] = this.dateService.getDateAndTime(new Date(dateStr));
  //   return [date, time];
  // }
}
