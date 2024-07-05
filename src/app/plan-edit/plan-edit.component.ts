import { ViewportScroller } from '@angular/common';
import { Component, OnInit, inject, input, signal } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { IconTooltipComponent } from '../components/icon-tooltip/icon-tooltip.component';
import { SaveButtonComponent } from '../components/save-button/save-button.component';
import { PlanService } from '../services/plan.service';
import { ThemeService } from '../services/theme.service';
import { PlanDetails } from '../shared/models/plan-details';

@Component({
  selector: 'app-plan-edit',
  standalone: true,
  imports: [IconTooltipComponent, SaveButtonComponent, ReactiveFormsModule],
  templateUrl: './plan-edit.component.html',
  styleUrl: './plan-edit.component.scss',
})
export class PlanEditComponent implements OnInit {
  // url params
  protected planName = input<string>();

  protected form = signal<FormGroup>(new FormGroup({}));
  protected planDetails = signal<PlanDetails>(new PlanDetails());
  protected scrollerOffset = signal<[number, number]>([0, 40]); // [x, y]

  protected readonly themeService: ThemeService = inject(ThemeService);
  private readonly planService: PlanService = inject(PlanService);
  private readonly router: Router = inject(Router);
  private readonly scroller: ViewportScroller = inject(ViewportScroller);

  ngOnInit(): void {
    this.themeService.changeTheme('silver');
    this.scroller.setOffset(this.scrollerOffset());
    this.planService
      .getPlanDetails(this.planName() || '')
      .subscribe((planDetails) => {
        console.log('==edit plan planDetails', planDetails);
        if (planDetails) {
          this.planDetails.set(planDetails);
        }
      });
  }

  onBackToPlanDetailsPage() {
    this.router.navigate([`/plan/${this.planName()}`]);
  }

  onReadinessSaveClick() {
    console.log('==onReadinessSaveClick');
  }
}
