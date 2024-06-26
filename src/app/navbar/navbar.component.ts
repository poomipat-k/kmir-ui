import { CommonModule } from '@angular/common';
import { Component, effect, inject } from '@angular/core';
import { ThemeService } from '../services/theme.service';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent {
  protected readonly userService: UserService = inject(UserService);
  protected readonly themeService: ThemeService = inject(ThemeService);

  constructor() {
    effect(() => {
      console.log(
        '==effect username:',
        this.userService.currentUser().username
      );
    });
  }
}
