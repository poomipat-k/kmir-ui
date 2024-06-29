import { Component, OnInit, inject, input } from '@angular/core';
import { Router } from '@angular/router';
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
  private readonly router: Router = inject(Router);

  ngOnInit(): void {
    this.themeService.changeTheme('silver');
  }

  onBackToHomePage() {
    this.router.navigate(['/']);
  }
}
