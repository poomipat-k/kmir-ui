import { Component, OnInit, inject, input, signal } from '@angular/core';
import { Router } from '@angular/router';
import { PlanService } from '../services/plan.service';
import { ThemeService } from '../services/theme.service';
import { PlanDetails } from '../shared/models/plan-details';

@Component({
  selector: 'app-plan-details',
  standalone: true,
  imports: [],
  templateUrl: './plan-details.component.html',
  styleUrl: './plan-details.component.scss',
})
export class PlanDetailsComponent implements OnInit {
  protected planName = input<string>();

  protected planDetails = signal<PlanDetails>(new PlanDetails());

  protected readonly themeService: ThemeService = inject(ThemeService);
  private readonly planService: PlanService = inject(PlanService);
  private readonly router: Router = inject(Router);

  ngOnInit(): void {
    this.themeService.changeTheme('silver');

    console.log('==planName', this.planName());
    this.planService
      .getPlanDetails(this.planName() || '')
      .subscribe((planDetails) => {
        console.log('==plan planDetails', planDetails);
        if (planDetails) {
          this.planDetails.set(planDetails);
        }
      });
  }

  onBackToHomePage() {
    this.router.navigate(['/']);
  }
}
