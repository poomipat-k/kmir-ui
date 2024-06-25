import { Component, OnInit, inject } from '@angular/core';
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

  ngOnInit(): void {
    this.themeService.changeTheme('gold');
  }
}
