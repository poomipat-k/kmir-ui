import { CommonModule, TitleCasePipe } from '@angular/common';
import { Component, computed, input, signal } from '@angular/core';
import { PlanDetails } from '../../shared/models/plan-details';
import { SafeHtmlPipe } from '../../shared/pipe/safe-html.pipe';
import { UpdatedAtComponent } from '../updated-at/updated-at.component';

@Component({
  selector: 'app-com-plan-note',
  standalone: true,
  imports: [CommonModule, UpdatedAtComponent, SafeHtmlPipe, TitleCasePipe],
  templateUrl: './plan-note.component.html',
  styleUrl: './plan-note.component.scss',
})
export class PlanNoteComponent {
  plans = input.required<PlanDetails[]>();

  activeIndex = signal(0);

  buttons = computed(() => {
    return this.plans().map((p) => p.name.replace('PLAN', 'P.'));
  });

  onPlanButtonClick(index: number) {
    this.activeIndex.set(index);
  }
}
