import { Component, inject, signal } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { InputTextComponent } from '../components/input-text/input-text.component';
import { ThemeService } from '../services/theme.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, InputTextComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  private readonly themeService: ThemeService = inject(ThemeService);
  protected passwordType = signal<'password' | 'text'>('password');

  protected form = signal(
    new FormGroup({
      username: new FormControl(null, [Validators.required]),
      password: new FormControl(null, [
        Validators.required,
        // Validators.minLength(8),
        // Validators.maxLength(60),
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
  }

  onPasswordTypeChange(type: 'text' | 'password') {
    this.passwordType.set(type);
  }
}
