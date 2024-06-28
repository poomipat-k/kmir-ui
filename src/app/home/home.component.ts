import { Component, OnInit, inject, signal } from '@angular/core';
import { PlanService } from '../services/plan.service';
import { ThemeService } from '../services/theme.service';
import { PreviewPlan } from '../shared/models/preview-plan';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit {
  protected themeService: ThemeService = inject(ThemeService);
  private readonly planService: PlanService = inject(PlanService);

  protected plans = signal<PreviewPlan[]>([]);

  ngOnInit(): void {
    this.themeService.changeTheme('gold');

    this.planService.getAllPreviewPlan().subscribe((res: PreviewPlan[]) => {
      console.log('==res', res);
      if (res && res.length > 0) {
        this.plans.set(res);
      }
    });
  }
}
