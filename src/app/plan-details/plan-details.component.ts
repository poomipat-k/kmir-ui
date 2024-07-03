import {
  Component,
  OnInit,
  computed,
  inject,
  input,
  signal,
} from '@angular/core';
import { Router } from '@angular/router';
import { MetricComponent } from '../components/metric/metric.component';
import { PlanService } from '../services/plan.service';
import { ThemeService } from '../services/theme.service';
import { MetricInput } from '../shared/models/metric-input';
import { PlanDetails } from '../shared/models/plan-details';

@Component({
  selector: 'app-plan-details',
  standalone: true,
  imports: [MetricComponent],
  templateUrl: './plan-details.component.html',
  styleUrl: './plan-details.component.scss',
})
export class PlanDetailsComponent implements OnInit {
  protected planName = input<string>();

  protected planDetails = signal<PlanDetails>(new PlanDetails());
  protected scoreDetails = computed(() => this.computeScore());

  protected metricData = computed(() => this.computeScore());

  protected readonly themeService: ThemeService = inject(ThemeService);
  private readonly planService: PlanService = inject(PlanService);
  private readonly router: Router = inject(Router);

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
    console.log('==scoreData', scoreData);
    return scoreData || [];
  }

  onBackToHomePage() {
    this.router.navigate(['/']);
  }
}
