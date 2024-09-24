import { CommonModule, ViewportScroller } from '@angular/common';
import {
  Component,
  OnInit,
  computed,
  inject,
  input,
  signal,
} from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { BackToTopComponent } from '../components/back-to-top/back-to-top.component';
import { IconTooltipComponent } from '../components/icon-tooltip/icon-tooltip.component';
import { InstructionNoteComponent } from '../components/instruction-note/instruction-note.component';
import { MetricScoreSummaryComponent } from '../components/metric-score-summary/metric-score-summary.component';
import { MetricComponent } from '../components/metric/metric.component';
import { ScoreDetailsLinkComponent } from '../components/score-details-link/score-details-link.component';
import { ScoreScaleDetailsComponent } from '../components/score-scale-details/score-scale-details.component';
import { ScoreTableComponent } from '../components/score-table/score-table.component';
import { UpdatedAtComponent } from '../components/updated-at/updated-at.component';
import { DateService } from '../services/date.service';
import { PlanService } from '../services/plan.service';
import { ThemeService } from '../services/theme.service';
import { UserService } from '../services/user.service';
import { IntersectionElementDirective } from '../shared/directives/intersection-element.directive';
import { MetricCell } from '../shared/models/metric-cell';
import { MetricInput } from '../shared/models/metric-input';
import { PlanDetails } from '../shared/models/plan-details';
import { ScoreTableRow } from '../shared/models/score-table-row';
import { SafeHtmlPipe } from '../shared/pipe/safe-html.pipe';

@Component({
  selector: 'app-plan-details',
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
    MetricScoreSummaryComponent,
    ScoreDetailsLinkComponent,
    InstructionNoteComponent,
    ScoreScaleDetailsComponent,
  ],
  templateUrl: './plan-details.component.html',
  styleUrl: './plan-details.component.scss',
})
export class PlanDetailsComponent implements OnInit {
  protected planName = input<string>();

  protected planDetails = signal<PlanDetails>(new PlanDetails());
  protected intersectionRootMargin = signal('0px 0px -50% 0px');
  /*
  0: inactive
  1: temp (last active item before goes out of intersection area)
  2: active
  */
  protected navActiveList = signal([2, 0, 0, 0, 0]);
  protected scrollerOffset = signal<[number, number]>([0, 40]); // [x, y]
  protected ignoreIntersection = signal(false);
  protected releaseIgnoreIntersectionTimeoutId = signal<any>(undefined);
  protected metricSelectedCell = signal<MetricCell | undefined>(undefined);
  protected readinessTooltipText = signal(
    'กรอบการประเมินความพร้อมด้านต่างประเทศอ้างอิงจากการทบทวนวรรณกรรมและปรับให้เหมาะสมกับบริบทงานต่างประเทศของ สสส. มุ่งเน้น 2 มิติหลัก ได้แก่ ความเต็มใจ (Willingness) และขีดความสามารถ (Capacity) ของแผนงานหรือสำนักต่างๆในการมีส่วนร่วมในการดำเนินงานด้านต่างประเทศอย่างมีประสิทธิผล การแปรผลแบบเมทริกซ์ เหมาะแก่การใช้ประโยชน์ด้านการตัดสินใจเชิงกลยุทธ์ภายใน สสส.'
  );
  protected assessmentScoreTooltip = signal(
    `แบบสอบถามดัชนีความพร้อมด้านต่างประเทศเกิดจากการทบทวนและทดลองนำร่อง ประกอบด้วย 7 ข้อคำถาม จากการประเมินทั้ง 2 มุมมองเพื่อให้ได้ภาพรวมที่ครอบคลุมเกี่ยวกับความพร้อมของแต่ละสำนัก/แผน ได้แก่

1. การประเมินจากภายนอกจากฝ่ายวิเทศสัมพันธ์ (สำนักพัฒนาภาคีสัมพันธ์และวิเทศสัมพันธ์) ชุดคำถามนี้จะได้รับการออกแบบมาเพื่อประเมินความพร้อมของสำนัก/แผน จากมุมมองภายนอกอย่างเป็นรูปธรรม โดยจะมุ่งเน้นไปที่วิธีที่สำนัก/แผนจัดการไปสู่ความสอดคล้องกับวัตถุประสงค์เชิงกลยุทธ์ การใช้ทรัพยากร และประสิทธิผลโดยรวมในการมีส่วนร่วมกับกิจกรรมที่เกี่ยวข้องกับงานด้านต่างประเทศ

2. การประเมินตนเองภายในโดยสำนัก/แผน ชุดคำถามนี้จะช่วยให้สำนัก/แผนดำเนินการประเมินตนเองด้านความพร้อมในการดำเนินงานด้านต่างประเทศ มุมมองนี้มีความสำคัญอย่างยิ่งสำหรับกระบวนการทำความเข้าใจภายในตนเอง การประเมินศักยภาพภายในและทีมฝ่ายวิเทศสัมพันธ์ และชี้แนวทางการพัฒนาในอนาคต
`
  );
  protected irWorkGoalTooltip = signal(
    `เป้าหมายการทำงานด้านต่างประเทศ ออกแบบมาเพื่อปรับกิจกรรมของแต่ละแผนให้สอดคล้องกับความพร้อมของการมีส่วนร่วม เพื่อสร้างรูปธรรมในการดำเนินการในขั้นต่อไป เป็นพื้นฐานสำหรับการพัฒนาแผนปฏิบัติการแต่ละแผน ซึ่งสามารถปรับเปลี่ยนตามผลลัพธ์ของการประเมินความพร้อม 

    ทั้งนี้ได้แบ่งระดับเป้าหมายออกเป็น 5 ระดับตามความคาดหวังต่อผลลัพธ์ดังนี้

ระดับ 1: ความต้องการนำกระบวนการ ความรู้และการเคลื่อนไหวด้านสุขภาพระดับโลกมาปรับใช้ในการดำเนินงานภายในของแผนงานของสสส. 
ระดับ 2: ความต้องการเผยแพร่ผลงานของสสส. (แนวปฏิบัติที่ดี กรณีศึกษา) บนเวทีระหว่างประเทศ 
ระดับ 3: ความต้องการเข้าร่วมเครือข่ายและพันธมิตรระดับภูมิภาคและระดับโลกที่เกี่ยวข้องกับขอบเขตงาน 
ระดับ 4: ความต้องการเป็นผู้นำการหารือ อภิปรายและผลักดันความเคลื่อนไหวในเครือข่ายและพันธมิตรระดับภูมิภาคและระดับโลกที่เกี่ยวข้องกับประเด็นและผลประโยชน์ของสสส. ระดับ 5: ความต้องการมีบทบาทในการกำหนดนโยบายสุขภาพโลกในระดับภูมิภาคและระดับโลกอย่างแข็งขัน รวมถึงการเข้าร่วมในเวทีระหว่างประเทศ
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
  protected metricData = computed(() => this.computeScore());
  protected scoreTableData = computed(() => this.computedScoreTable());
  protected baseLink = computed(() => `/plan/${this.planName()}`);

  protected readonly themeService: ThemeService = inject(ThemeService);
  private readonly planService: PlanService = inject(PlanService);
  private readonly router: Router = inject(Router);
  protected readonly userService: UserService = inject(UserService);
  private readonly scroller: ViewportScroller = inject(ViewportScroller);
  private readonly dateService: DateService = inject(DateService);

  ngOnInit(): void {
    this.themeService.changeTheme('silver');
    this.scroller.setOffset(this.scrollerOffset());
    this.planService
      .getPlanDetails(this.planName() || '')
      .subscribe((planDetails) => {
        if (planDetails) {
          this.planDetails.set(planDetails);
        }
      });
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

  toEditPage() {
    this.router.navigate([`/plan/${this.planName()}/edit`]);
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
    const selectedCell = this.metricSelectedCell();
    if (selectedCell?.name === 'hasData' && selectedCell?.data?.length > 0) {
      const x = selectedCell.data[0].x;
      const y = selectedCell.data[0].y;
      return scoreData.filter((c) => c.x === x && c.y === y);
    }

    return scoreData || [];
  }

  computedScoreTable(): ScoreTableRow[] {
    const plans = this.planDetails();
    const res = plans.assessmentCriteria?.map(
      (c) => new ScoreTableRow(c.orderNumber, undefined, c.display)
    );
    const now = new Date();
    const [year] = this.dateService.getYearMonthDay(now);

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
    return `latest edit by ${who} ${local}`;
  }

  onBackToHomePage() {
    this.router.navigate(['/']);
  }

  onNavItemClick(index: number) {
    this.ignoreIntersection.set(true);
    const newList = [0, 0, 0, 0, 0];
    newList[index] = 2;
    this.navActiveList.set(newList);
    this.resetReleaseIgnoreIntersectionTimer();
  }

  onMetricCellClick(cell: MetricCell) {
    if (
      cell?.data?.[0]?.x === this.metricSelectedCell()?.data?.[0]?.x &&
      cell?.data?.[0]?.y === this.metricSelectedCell()?.data?.[0]?.y
    ) {
      return;
    }
    // Set new selected cell to trigger recalculation of metric data
    this.metricSelectedCell.set(cell);
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
