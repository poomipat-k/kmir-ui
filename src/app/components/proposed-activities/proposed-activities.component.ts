import { CommonModule, TitleCasePipe } from '@angular/common';
import { Component, computed, input, signal } from '@angular/core';
import { PlanDetails } from '../../shared/models/plan-details';
import { SafeHtmlPipe } from '../../shared/pipe/safe-html.pipe';
import { UpdatedAtComponent } from '../updated-at/updated-at.component';

@Component({
  selector: 'app-com-proposed-activities',
  standalone: true,
  imports: [CommonModule, UpdatedAtComponent, SafeHtmlPipe, TitleCasePipe],
  templateUrl: './proposed-activities.component.html',
  styleUrl: './proposed-activities.component.scss',
})
export class ProposedActivitiesComponent {
  plans = input.required<PlanDetails[]>();

  activeIndex = signal(0);

  buttons = computed(() => {
    return this.plans().map((p) => p.name.replace('PLAN', 'P.'));
  });

  updatedText = computed(() => {
    const selectedPlan = this.plans()[this.activeIndex()];
    const who = selectedPlan.proposedActivityUpdatedBy;
    const date = new Date(selectedPlan.proposedActivityUpdatedAt ?? 0);
    const local = date.toLocaleString('en-GB', {
      hourCycle: 'h24',
      timeZone: 'Asia/bangkok',
    });
    return `latest edit by ${who} ${local}`;
  });

  onPlanButtonClick(index: number) {
    this.activeIndex.set(index);
  }
}
