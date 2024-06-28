import { animate, style, transition, trigger } from '@angular/animations';
import { CommonModule } from '@angular/common';
import {
  Component,
  ElementRef,
  OnInit,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { PlanService } from '../services/plan.service';
import { ThemeService } from '../services/theme.service';
import { PlanCard } from '../shared/models/plan-card';
import { PreviewPlan } from '../shared/models/preview-plan';

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
  test = viewChild<ElementRef>('test');
  protected themeService: ThemeService = inject(ThemeService);
  private readonly planService: PlanService = inject(PlanService);

  protected plans = signal<PlanCard[]>([]);

  ngOnInit(): void {
    this.themeService.changeTheme('gold');

    this.planService.getAllPreviewPlan().subscribe((res: PreviewPlan[]) => {
      if (res && res.length > 0) {
        this.plans.set(
          res.map((plan) => {
            const item = new PlanCard();
            item.data = plan;
            item.open = false;
            return item;
          })
        );
      }
    });
  }

  onCardClick(index: number) {
    console.log('===test', this.test()?.nativeElement.clientHeight);
    this.plans.update((oldValue) => {
      oldValue[index].open = !oldValue[index].open;
      return oldValue;
    });
  }
}
