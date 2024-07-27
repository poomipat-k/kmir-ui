import { animate, style, transition, trigger } from '@angular/animations';
import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { PlanService } from '../services/plan.service';
import { ThemeService } from '../services/theme.service';
import { UserService } from '../services/user.service';
import { PlanCard } from '../shared/models/plan-card';
import { PreviewPlan } from '../shared/models/preview-plan';
import { User } from '../shared/models/user';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  animations: [
    trigger('slide', [
      transition(':enter', [
        style({ opacity: 0, height: 0, padding: '0 32px' }),
        animate(
          '300ms ease-out',
          style({ opacity: 1, height: '*', padding: '32px' })
        ),
      ]),
      transition(':leave', [
        style({ opacity: 1, height: '*', padding: '32px' }),
        animate(
          '300ms ease-out',
          style({ opacity: 0, height: 0, padding: '0 32px' })
        ),
      ]),
    ]),
  ],
})
export class HomeComponent implements OnInit {
  protected themeService: ThemeService = inject(ThemeService);
  private readonly planService: PlanService = inject(PlanService);
  protected readonly userService: UserService = inject(UserService);
  private readonly router: Router = inject(Router);

  protected plans = signal<PlanCard[]>([]);

  ngOnInit(): void {
    this.themeService.changeTheme('gold');

    this.planService.getAllPreviewPlan().subscribe((res: PreviewPlan[]) => {
      console.log('==res', res);

      if (res && res.length > 0) {
        const curUser = this.getCurrentUser();
        const myPlan = res.find((plan) => plan.userId === curUser.id);
        if (!myPlan) {
          return;
        }
        const firstPlanCard = new PlanCard();
        firstPlanCard.data = myPlan;
        firstPlanCard.open = false;
        const sortedPlan = [firstPlanCard];

        res.forEach((plan) => {
          if (plan.id !== myPlan.id) {
            const item = new PlanCard();
            item.data = plan;
            item.open = false;
            sortedPlan.push(item);
          }
        });
        this.plans.set(sortedPlan);
      }
    });
  }

  getCurrentUser(): User {
    return this.userService.currentUser();
  }

  onCardClick(index: number) {
    this.plans.update((oldValue) => {
      oldValue[index].open = !oldValue[index].open;
      return oldValue;
    });
  }

  canAccessPlanDetails(index: number) {
    return (
      this.userService.currentUser().id === this.plans()[index].data.userId ||
      this.getCurrentUser().userRole === 'admin' ||
      this.getCurrentUser().userRole === 'viewer'
    );
  }

  goToPlanDetailsPage(e: MouseEvent, index: number) {
    if (this.canAccessPlanDetails(index)) {
      e.stopImmediatePropagation();
      const planName = this.plans()[index]?.data?.name;
      if (planName.toLocaleLowerCase() === 'admin') {
        this.router.navigate(['admin/dashboard']);
        return;
      }
      this.router.navigate([`plan/${this.plans()[index].data.name}`]);
    }
  }
}
