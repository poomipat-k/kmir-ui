import {
  Component,
  OnInit,
  computed,
  inject,
  input,
  signal,
} from '@angular/core';
import { Router } from '@angular/router';
import { IconTooltipComponent } from '../components/icon-tooltip/icon-tooltip.component';
import { MetricComponent } from '../components/metric/metric.component';
import { ScoreTableComponent } from '../components/score-table/score-table.component';
import { UpdatedAtComponent } from '../components/updated-at/updated-at.component';
import { PlanService } from '../services/plan.service';
import { ThemeService } from '../services/theme.service';
import { UserService } from '../services/user.service';
import { MetricInput } from '../shared/models/metric-input';
import { PlanDetails } from '../shared/models/plan-details';
import { ScoreTableRow } from '../shared/models/score-table-row';

@Component({
  selector: 'app-plan-details',
  standalone: true,
  imports: [
    MetricComponent,
    UpdatedAtComponent,
    ScoreTableComponent,
    IconTooltipComponent,
  ],
  templateUrl: './plan-details.component.html',
  styleUrl: './plan-details.component.scss',
})
export class PlanDetailsComponent implements OnInit {
  protected planName = input<string>();

  protected planDetails = signal<PlanDetails>(new PlanDetails());
  protected scoreDetails = computed(() => this.computeScore());

  protected metricData = computed(() => this.computeScore());
  protected scoreTableData = computed(() => this.computedScoreTable());

  protected readonly themeService: ThemeService = inject(ThemeService);
  private readonly planService: PlanService = inject(PlanService);
  private readonly router: Router = inject(Router);
  protected readonly userService: UserService = inject(UserService);

  ngOnInit(): void {
    this.themeService.changeTheme('silver');
    this.planService
      .getPlanDetails(this.planName() || '')
      .subscribe((planDetails) => {
        console.log('==plan planDetails', planDetails);
        if (planDetails) {
          this.planDetails.set(planDetails);
        }
      });
  }

  computeScore() {
    // find avg score for each year
    const criteriaMap: { [key: number]: 'x' | 'y' } = {};
    this.planDetails()?.assessmentCriteria?.forEach((cri) => {
      criteriaMap[cri.orderNumber] = cri.category === 'willingness' ? 'x' : 'y';
    });
    const scoreData: MetricInput[] = [];
    const sumScoreByYear: { [key: number]: { x: number; y: number } } = {};
    this.planDetails()?.assessmentScore?.forEach((row) => {
      const axis: 'x' | 'y' = criteriaMap[row.criteriaOrder];
      if (!sumScoreByYear[row.year]) {
        sumScoreByYear[row.year] = { x: 0, y: 0 };
      }
      sumScoreByYear[row.year][axis] += row.score;
    });
    let divideX = 0;
    let divideY = 0;
    for (const [_, v] of Object.entries(criteriaMap)) {
      if (v === 'x') {
        divideX += 1;
      } else {
        divideY += 1;
      }
    }
    if (divideX === 0 || divideY === 0) {
      return [];
    }
    for (const [k, v] of Object.entries(sumScoreByYear)) {
      // Divide by 2 is for admin and plan owner
      scoreData.push(
        new MetricInput(
          Math.round(v.x / 2 / divideX),
          Math.round(v.y / 2 / divideY),
          +k,
          this.planDetails().name
        )
      );
    }
    return scoreData || [];
  }

  computedScoreTable(): ScoreTableRow[] {
    const plans = this.planDetails();
    const res = plans.assessmentCriteria?.map((c) => {
      const row = new ScoreTableRow();
      row.order = c.orderNumber;
      row.question = c.display;
      return row;
    });
    const now = new Date();
    const nowLocal = now.toLocaleDateString('en-GB', {
      timeZone: 'Asia/bangkok',
    });
    const split = nowLocal.split('/');
    const year = +split[split.length - 1];

    plans.assessmentScore?.forEach((row) => {
      // Only display score for current year and from the owner of the plan
      if (row.year === year && row.userRole === 'user') {
        res[row.criteriaOrder - 1].score = row.score;
      }
    });
    return res || [];
  }

  getEditHistory(name: string): string {
    const plan = this.planDetails();
    if (name === 'readinessWillingness') {
      const updatedAt = plan.readinessWillingnessUpdatedAt;
      const updatedBy = plan.readinessWillingnessUpdatedBy;
      return this.generateUpdatedAtString(updatedAt, updatedBy);
    }
    if (name === 'assessmentScore') {
      let latestUpdateIndex = -1;
      let date = new Date(0);
      plan.assessmentScore?.forEach((item, index) => {
        const newDate = new Date(item.createdAt);
        if (newDate > date) {
          date = newDate;
          latestUpdateIndex = index;
        }
      });
      if (latestUpdateIndex < 0) {
        return '';
      }
      return this.generateUpdatedAtString(
        plan.assessmentScore[latestUpdateIndex].createdAt,
        plan.assessmentScore[latestUpdateIndex].userRole
      );
    }
    if (name === 'irGoal') {
      const typeUpdatedAt = new Date(plan.irGoalTypeUpdatedAt || 0);
      const detailsUpdatedAt = new Date(plan.irGoalDetailsUpdatedAt || 0);
      const updatedAt =
        typeUpdatedAt > detailsUpdatedAt
          ? plan.irGoalTypeUpdatedAt
          : plan.irGoalDetailsUpdatedAt;
      const updatedBy =
        typeUpdatedAt > detailsUpdatedAt
          ? plan.irGoalTypeUpdatedBy
          : plan.irGoalDetailsUpdatedBy;
      return this.generateUpdatedAtString(updatedAt || '', updatedBy || '');
    }
    return 'Todo';
  }

  private generateUpdatedAtString(
    updatedAt: string,
    updatedBy: string
  ): string {
    const user = this.userService.currentUser();
    const who =
      updatedBy === 'user' ? user.displayName || user.username : 'ADMIN';
    const date = new Date(updatedAt);
    const local = date.toLocaleString('en-GB', {
      hourCycle: 'h24',
      timeZone: 'Asia/bangkok',
    });
    return `last edited by ${who} ${local}`;
  }

  onBackToHomePage() {
    this.router.navigate(['/']);
  }
}
