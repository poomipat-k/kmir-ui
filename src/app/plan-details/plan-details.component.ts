import { Component, OnInit, inject, input } from '@angular/core';
import { Router } from '@angular/router';
import { PlanService } from '../services/plan.service';
import { ThemeService } from '../services/theme.service';

@Component({
  selector: 'app-plan-details',
  standalone: true,
  imports: [],
  templateUrl: './plan-details.component.html',
  styleUrl: './plan-details.component.scss',
})
export class PlanDetailsComponent implements OnInit {
  protected planName = input<string>();

  protected readonly themeService: ThemeService = inject(ThemeService);
  private readonly planService: PlanService = inject(PlanService);
  private readonly router: Router = inject(Router);

  ngOnInit(): void {
    this.themeService.changeTheme('silver');

    console.log('==planName', this.planName());
    this.planService.getPlanDetails(this.planName() || '').subscribe((res) => {
      console.log('==plan result', res);
    });
  }

  onBackToHomePage() {
    this.router.navigate(['/']);
  }
}
