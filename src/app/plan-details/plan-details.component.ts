import { Component, OnInit, inject } from '@angular/core';
import { ThemeService } from '../services/theme.service';

@Component({
  selector: 'app-plan-details',
  standalone: true,
  imports: [],
  templateUrl: './plan-details.component.html',
  styleUrl: './plan-details.component.scss',
})
export class PlanDetailsComponent implements OnInit {
  protected readonly themeService: ThemeService = inject(ThemeService);

  ngOnInit(): void {
    this.themeService.changeTheme('silver');
  }
}
