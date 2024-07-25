import { Component, inject, input } from '@angular/core';
import { DateService } from '../../services/date.service';
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

  private readonly dateService: DateService = inject(DateService);

  getEditedItemList(plan: PlanDetails): string[] {
    const list = [];
    const ts = plan.updatedAt;
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
  }

  getDateAndTime(dateStr: string) {
    if (!dateStr) {
      return '';
    }
    const [date, time] = this.dateService.getDateAndTime(new Date(dateStr));
    return [date, time];
  }
}
