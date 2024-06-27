import { Component, OnInit, inject } from '@angular/core';
import { PlanService } from '../services/plan.service';
import { ThemeService } from '../services/theme.service';

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

  ngOnInit(): void {
    this.themeService.changeTheme('gold');

    this.planService.getAllPreviewPlan().subscribe((res) => {
      console.log('===res', res);
    });
  }
}
