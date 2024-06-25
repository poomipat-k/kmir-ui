import { Component, OnInit, inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ThemeService } from '../services/theme.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent implements OnInit {
  private readonly themeService: ThemeService = inject(ThemeService);

  protected form: FormGroup;

  constructor() {
    this.themeService.changeTheme('gold');
    this.initForm();
  }

  ngOnInit(): void {
    this.initForm();
  }

  onSubmit() {
    console.log('==this.form', this.form);
  }

  private initForm(): void {
    this.form = new FormGroup({
      username: new FormControl(null, [Validators.required]),
      password: new FormControl(null, [
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(60),
      ]),
    });
  }
}
