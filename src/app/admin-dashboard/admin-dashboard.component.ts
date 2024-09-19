import { CommonModule, ViewportScroller } from '@angular/common';
import {
  Component,
  computed,
  inject,
  OnDestroy,
  OnInit,
  signal,
  WritableSignal,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
import { AdminNoteComponent } from '../components/admin-note/admin-note.component';
import { BackToTopComponent } from '../components/back-to-top/back-to-top.component';
import { ChangeLogComponent } from '../components/change-log/change-log.component';
import { IconTooltipComponent } from '../components/icon-tooltip/icon-tooltip.component';
import { MetricScoreSummaryComponent } from '../components/metric-score-summary/metric-score-summary.component';
import { MetricComponent } from '../components/metric/metric.component';
import { PlanNoteComponent } from '../components/plan-note/plan-note.component';
import { ProposedActivitiesComponent } from '../components/proposed-activities/proposed-activities.component';
import { ScoreTableAdminComponent } from '../components/score-table-admin/score-table-admin.component';
import { SelectDropdownComponent } from '../components/select-dropdown/select-dropdown.component';
import { UpdatedAtComponent } from '../components/updated-at/updated-at.component';
import { DateService } from '../services/date.service';
import { PlanService } from '../services/plan.service';
import { ThemeService } from '../services/theme.service';
import { UserService } from '../services/user.service';
import { IntersectionElementDirective } from '../shared/directives/intersection-element.directive';
import { AssessmentCriteria } from '../shared/models/assessment-criteria';
import { AssessmentScore } from '../shared/models/assessment-score';
import { DropdownOption } from '../shared/models/dropdown-option';
import { LatestScore } from '../shared/models/latest-score';
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
    IconTooltipComponent,
    BackToTopComponent,
    IntersectionElementDirective,
    RouterModule,
    SafeHtmlPipe,
    SelectDropdownComponent,
    ScoreTableAdminComponent,
    ProposedActivitiesComponent,
    PlanNoteComponent,
    AdminNoteComponent,
    ChangeLogComponent,
    MetricScoreSummaryComponent,
  ],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.scss',
})
export class AdminDashboardComponent implements OnInit, OnDestroy {
  protected intersectionRootMargin = signal('0px 0px -50% 0px');
  /*
  0: inactive
  1: temp (last active item before goes out of intersection area)
  2: active
  */
  protected navActiveList = signal([2, 0, 0, 0]);
  protected scrollerOffset = signal<[number, number]>([0, 40]); // [x, y]
  protected ignoreIntersection = signal(false);
  protected releaseIgnoreIntersectionTimeoutId = signal<any>(undefined);
  protected baseLink = signal('/admin/dashboard');
  protected metricFormGroup: WritableSignal<FormGroup> = signal(
    new FormGroup({})
  );
  protected minYear = signal(2022);
  protected metricYearOptions = signal<DropdownOption[]>([]);
  protected criteriaList = signal<AssessmentCriteria[]>([]);
  protected plans = signal<PlanDetails[]>([]);
  protected metricScores = signal<AssessmentScore[]>([]);
  protected adminNote = signal('');
  protected latestScores = signal<LatestScore[]>([]);
  protected prevNavIndex = signal(0);
  protected readinessTooltipText = signal(
    'กรอบการประเมินความพร้อมด้านต่างประเทศอ้างอิงจากการทบทวนวรรณกรรมและปรับให้เหมาะสมกับบริบทงานต่างประเทศของ สสส. มุ่งเน้น 2 มิติหลัก ได้แก่ ความเต็มใจ (Willingness) และขีดความสามารถ (Capacity) ของแผนงานหรือสำนักต่างๆในการมีส่วนร่วมในการดำเนินงานด้านต่างประเทศอย่างมีประสิทธิผล การแปรผลแบบเมทริกซ์ เหมาะแก่การใช้ประโยชน์ด้านการตัดสินใจเชิงกลยุทธ์ภายใน สสส.'
  );
  protected assessmentScoreTooltip = signal(
    `แบบสอบถามดัชนีความพร้อมด้านต่างประเทศเกิดจากการทบทวนและทดลองนำร่อง ประกอบด้วย 7 ข้อคำถาม จากการประเมินทั้ง 2 มุมมองเพื่อให้ได้ภาพรวมที่ครอบคลุมเกี่ยวกับความพร้อมของแต่ละสำนัก/แผน ได้แก่

1. การประเมินจากภายนอกจากฝ่ายวิเทศสัมพันธ์ (สำนักพัฒนาภาคีสัมพันธ์และวิเทศสัมพันธ์) ชุดคำถามนี้จะได้รับการออกแบบมาเพื่อประเมินความพร้อมของสำนัก/แผน จากมุมมองภายนอกอย่างเป็นรูปธรรม โดยจะมุ่งเน้นไปที่วิธีที่สำนัก/แผนจัดการไปสู่ความสอดคล้องกับวัตถุประสงค์เชิงกลยุทธ์ การใช้ทรัพยากร และประสิทธิผลโดยรวมในการมีส่วนร่วมกับกิจกรรมที่เกี่ยวข้องกับงานด้านต่างประเทศ

2. การประเมินตนเองภายในโดยสำนัก/แผน ชุดคำถามนี้จะช่วยให้สำนัก/แผนดำเนินการประเมินตนเองด้านความพร้อมในการดำเนินงานด้านต่างประเทศ มุมมองนี้มีความสำคัญอย่างยิ่งสำหรับกระบวนการทำความเข้าใจภายในตนเอง การประเมินศักยภาพภายในและทีมฝ่ายวิเทศสัมพันธ์ และชี้แนวทางการพัฒนาในอนาคต
`
  );

  protected navActiveIndex = computed<number>(() => {
    const list = this.navActiveList();
    for (let i = list.length - 1; i >= 0; i--) {
      if (list[i] > 0) {
        return i;
      }
    }
    return 0;
  });
  protected planOptions = computed(() => {
    const options: DropdownOption[] =
      this.plans()?.map((p) => ({
        value: p.name,
        display: p.name,
      })) || [];
    options.unshift({
      value: 'all',
      display: 'All Plan',
    });
    return options;
  });

  protected metricData = computed(() => this.computeScoreMetic());
  protected topicShortMap = computed(() => this.computeTopicShortMap());
  protected topicShortList = computed(() => this.computeTopicShortList());
  protected assessmentScoreData = computed(() => this.computeAssessmentData());
  protected scoreTableLatestUpdateText = computed(() =>
    this.computedScoreTableLatestUpdateText()
  );

  protected readonly themeService: ThemeService = inject(ThemeService);
  private readonly planService: PlanService = inject(PlanService);
  private readonly router: Router = inject(Router);
  protected readonly userService: UserService = inject(UserService);
  private readonly scroller: ViewportScroller = inject(ViewportScroller);
  private readonly dateService: DateService = inject(DateService);

  private readonly subs: Subscription[] = [];

  ngOnInit(): void {
    this.themeService.changeTheme('silver');
    this.scroller.setOffset(this.scrollerOffset());
    this.initMetricControlValue();

    this.planService.getAllPlansDetails().subscribe((res) => {
      if (res?.assessmentCriteria?.length > 0) {
        this.criteriaList.set(res.assessmentCriteria);
      }
      if (res?.planDetails?.length > 0) {
        this.plans.set(res.planDetails);
      }
      if (res?.latestScores) {
        this.latestScores.set(res.latestScores);
      }
      this.adminNote.set(res.adminNote);
    });

    this.refreshMetric();

    this.metricFormGroup().valueChanges.subscribe(() => {
      this.refreshMetric();
    });
  }

  ngOnDestroy(): void {
    this.subs.forEach((s) => s.unsubscribe());
  }

  private computeAssessmentData() {
    const plans = this.plans();
    const scoreData = plans?.map((plan) => {
      return (
        plan?.assessmentScore?.map(
          (s) => new ScoreTableRow(s.criteriaOrder, s.score)
        ) || []
      );
    });
    return scoreData || [];
  }

  refreshMetric() {
    const controls = this.metricFormGroup().controls;
    this.planService
      .adminGetScores(
        controls['fromYear']?.value,
        controls['toYear']?.value,
        controls['plan']?.value
      )
      .subscribe((scores) => {
        this.metricScores.set(scores || []);
      });
  }

  private computedScoreTableLatestUpdateText() {
    let latestScore = new AssessmentScore();
    let maxDate = new Date(0);
    this.plans().forEach((plan) => {
      const newDate = new Date(plan.assessmentScore?.[0]?.createdAt);
      if (plan?.assessmentScore?.[0]?.createdAt && newDate > maxDate) {
        maxDate = newDate;
        latestScore = plan?.assessmentScore?.[0];
      }
    });
    const date = new Date(latestScore.createdAt ?? 0);
    const localDateTime = date.toLocaleString('en-GB', {
      hourCycle: 'h24',
      timeZone: 'Asia/bangkok',
    });
    return `latest edit by Admin ${localDateTime}`;
  }

  initMetricControlValue() {
    const [currentYear] = this.dateService.getYearMonthDay(new Date());
    this.metricFormGroup.set(
      new FormGroup({
        fromYear: new FormControl(this.minYear(), Validators.required),
        toYear: new FormControl(currentYear, Validators.required),
        plan: new FormControl('all', Validators.required),
      })
    );
  }

  isIntersecting(intersecting: boolean, index: number) {
    if (this.ignoreIntersection()) {
      return;
    }
    this.navActiveList.update((oldList) => {
      const newList = [...oldList];
      if (intersecting) {
        newList[index] = 2;
        // clear all temp when has new intersection
        for (let i = 0; i < newList.length; i++) {
          if (newList[i] === 1) {
            newList[i] = 0;
          }
        }
      } else {
        newList[index] = 0;
        const sum = newList.reduce((acc: number, a: number) => {
          return acc + a;
        }, 0);
        if (sum === 0) {
          for (let i = newList.length - 1; i >= 0; i--) {
            if (oldList[i] > 0) {
              newList[i] = 1;
              break;
            }
          }
        }
      }
      return newList;
    });
  }

  getYearOptions() {
    const [year] = this.dateService.getYearMonthDay(new Date());
    const options: DropdownOption[] = [];
    for (let y = this.minYear(); y <= year; y++) {
      options.push(new DropdownOption(y, y));
    }
    return options;
  }

  toEditPage() {
    this.router.navigate([`/admin/dashboard/edit`]);
  }

  private computeScoreMetic() {
    // find avg score for each year
    const scoreData: MetricInput[] = [];
    /*
    {
      // planId
      1: {
        2024: 
        {
          x: 5,
          y: 8
        }
      }
    }
    */
    const sumScoreObj: {
      [planId: number]: { [year: number]: { x: number; y: number } };
    } = {};
    this.metricScores()?.forEach((row) => {
      const axis: 'x' | 'y' =
        row.criteriaCategory === 'willingness' ? 'x' : 'y';
      const planId = row.planId;
      if (!sumScoreObj[planId]) {
        sumScoreObj[planId] = {};
      }
      if (!sumScoreObj[planId][row.year]) {
        sumScoreObj[planId][row.year] = { x: 0, y: 0 };
      }
      sumScoreObj[planId][row.year][axis] += row.score;
    });
    // Todo: try refactor and remove hard code
    let divideX = 3;
    let divideY = 4;
    if (divideX === 0 || divideY === 0) {
      return [];
    }
    for (const planId of Object.keys(sumScoreObj)) {
      for (const [year, v] of Object.entries(sumScoreObj[+planId])) {
        // Divide by 2 is for admin and plan owner
        scoreData.push(
          new MetricInput(
            Math.round(v.x / 2 / divideX),
            Math.round(v.y / 2 / divideY),
            +year,
            this.topicShortMap()[+planId]
          )
        );
      }
    }
    return scoreData || [];
  }

  private computeTopicShortMap() {
    const map: { [key: number]: string } = {};
    this.plans()?.forEach((p) => {
      map[p.planId] = p.topicShort;
    });
    return map;
  }

  private computeTopicShortList(): string[] {
    const list = this.plans()?.map((p) => p.topicShort);
    return list;
  }

  getEditHistory(name: string, index: number): string {
    const plan = this.plans()[index];
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
    return `latest edit by ${who} ${local}`;
  }

  onBackToHomePage() {
    this.router.navigate(['/']);
  }

  onNavItemClick(index: number) {
    this.ignoreIntersection.set(true);
    const newList = [0, 0, 0, 0];
    newList[index] = 2; // mark as active
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
