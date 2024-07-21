import { CommonModule, ViewportScroller } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { BackToTopComponent } from '../components/back-to-top/back-to-top.component';
import { IconTooltipComponent } from '../components/icon-tooltip/icon-tooltip.component';
import { MetricComponent } from '../components/metric/metric.component';
import { ScoreTableComponent } from '../components/score-table/score-table.component';
import { SelectDropdownComponent } from '../components/select-dropdown/select-dropdown.component';
import { UpdatedAtComponent } from '../components/updated-at/updated-at.component';
import { DateService } from '../services/date.service';
import { PlanService } from '../services/plan.service';
import { ThemeService } from '../services/theme.service';
import { UserService } from '../services/user.service';
import { IntersectionElementDirective } from '../shared/directives/intersection-element.directive';
import { DropdownOption } from '../shared/models/dropdown-option';
import { MetricInput } from '../shared/models/metric-input';
import { PlanDetails } from '../shared/models/plan-details';
import { ScoreTableRow } from '../shared/models/score-table-row';
import { SafeHtmlPipe } from '../shared/pipe/safe-html.pipe';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MetricComponent,
    UpdatedAtComponent,
    ScoreTableComponent,
    IconTooltipComponent,
    BackToTopComponent,
    IntersectionElementDirective,
    RouterModule,
    SafeHtmlPipe,
    SelectDropdownComponent,
  ],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.scss',
})
export class AdminDashboardComponent {
  protected planDetails = signal<PlanDetails>(new PlanDetails());
  protected intersectionRootMargin = signal('0px 0px -50% 0px');
  protected navActiveList = signal([true, false, false, false, false]);
  protected scrollerOffset = signal<[number, number]>([0, 40]); // [x, y]
  protected ignoreIntersection = signal(false);
  protected releaseIgnoreIntersectionTimeoutId = signal<any>(undefined);
  protected baseLink = signal('admin/dashboard');
  protected metricForm = signal(
    new FormGroup({
      fromYear: new FormControl(null, Validators.required),
      toYear: new FormControl(null, Validators.required),
      selectedPlan: new FormControl(null),
    })
  );
  protected minYear = signal(2024);
  protected metricYearOptions = signal<DropdownOption[]>([]);

  protected navActiveIndex = computed<number>(() => {
    const list = this.navActiveList();
    for (let i = list.length - 1; i >= 0; i--) {
      if (list[i]) {
        return i;
      }
    }
    return 0;
  });

  protected metricData = computed(() => this.computeScore());
  protected scoreTableData = computed(() => this.computedScoreTable());

  protected readonly themeService: ThemeService = inject(ThemeService);
  private readonly planService: PlanService = inject(PlanService);
  private readonly router: Router = inject(Router);
  protected readonly userService: UserService = inject(UserService);
  private readonly scroller: ViewportScroller = inject(ViewportScroller);
  private readonly dateService = inject(DateService);

  ngOnInit(): void {
    this.themeService.changeTheme('silver');
    this.scroller.setOffset(this.scrollerOffset());
  }

  isIntersecting(intersecting: boolean, index: number) {
    if (this.ignoreIntersection()) {
      return;
    }
    this.navActiveList.update((oldList) => {
      const newList = [...oldList];
      newList[index] = intersecting;
      return newList;
    });
  }

  getYearOptions() {
    const [year, month, day] = this.dateService.getYearMonthDay(new Date());
    const options: DropdownOption[] = [];
    for (let y = this.minYear(); y <= year; y++) {
      options.push(new DropdownOption(y, y));
    }
    return options;
  }

  toEditPage() {
    this.router.navigate([`/admin/dashboard/edit`]);
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
          this.planDetails().topicShort
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
    if (name === 'proposedActivity') {
      const updatedAt = plan.proposedActivityUpdatedAt;
      const updatedBy = plan.proposedActivityUpdatedBy;
      return this.generateUpdatedAtString(updatedAt || '', updatedBy || '');
    }
    if (name === 'planNote') {
      const updatedAt = plan.planNoteUpdatedAt;
      const updatedBy = plan.planNoteUpdatedBy;
      return this.generateUpdatedAtString(updatedAt || '', updatedBy || '');
    }
    if (name === 'contactPerson') {
      const updatedAt = plan.contactPersonUpdatedAt;
      const updatedBy = plan.contactPersonUpdatedBy;
      return this.generateUpdatedAtString(updatedAt || '', updatedBy || '');
    }
    return 'Something wrong';
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

  onNavItemClick(index: number) {
    this.ignoreIntersection.set(true);
    const newList = [false, false, false, false, false];
    newList[index] = true;
    this.navActiveList.set(newList);
    this.resetReleaseIgnoreIntersectionTimer();
  }

  private resetReleaseIgnoreIntersectionTimer() {
    if (!!this.releaseIgnoreIntersectionTimeoutId()) {
      clearTimeout(this.releaseIgnoreIntersectionTimeoutId());
    }
    const timer = setTimeout(() => {
      this.ignoreIntersection.set(false);
    }, 800);
    this.releaseIgnoreIntersectionTimeoutId.set(timer);
  }
}
