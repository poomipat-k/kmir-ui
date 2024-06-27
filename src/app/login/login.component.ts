import { Component, inject, signal } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { InputTextComponent } from '../components/input-text/input-text.component';
import { ThemeService } from '../services/theme.service';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, InputTextComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  private readonly themeService: ThemeService = inject(ThemeService);
  private readonly userService: UserService = inject(UserService);
  private readonly router = inject(Router);

  private readonly subs: Subscription[] = [];

  protected passwordType = signal<'password' | 'text'>('password');
  protected formTouched = signal(false);

  protected form = signal(
    new FormGroup({
      username: new FormControl(null, [Validators.required]),
      password: new FormControl(null, [
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(60),
      ]),
    })
  );

  constructor() {
    this.themeService.changeTheme('gold');
  }

  getControl(name: string): FormControl {
    return this.form().get(name) as FormControl;
  }

  onSubmit() {
    console.log('==[onSubmit] this.form()', this.form());
    this.formTouched.set(true);
    if (!this.form().valid) {
      console.log('==form is not valid');
      return;
    }
    this.subs.push(
      this.userService
        .login(
          this.getControl('username').value,
          this.getControl('password').value
        )
        .subscribe((result) => {
          if (result.success) {
            this.router.navigate(['/']);
          }
        })
    );
  }

  onPasswordTypeChange(type: 'text' | 'password') {
    this.passwordType.set(type);
  }
}
