import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ThemeService } from '../services/theme.service';
import { UserService } from '../services/user.service';
import { User } from '../shared/models/user';

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
  private readonly router: Router = inject(Router);

  onLogout() {
    this.userService.logout().subscribe((res) => {
      if (res.success) {
        console.log('==logout successfully');
        this.router.navigate(['/login']);
        this.userService.currentUser.set(new User());
      }
    });
  }
}
