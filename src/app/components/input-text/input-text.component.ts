import { Component, input, output } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-com-input-text',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './input-text.component.html',
  styleUrl: './input-text.component.scss',
})
export class InputTextComponent {
  control = input(new FormControl());
  id = input.required<string>();
  placeholder = input<string>('');
  type = input<'text' | 'password' | 'email'>('text');
  isPassword = input(false);
  width = input('100%');
  height = input('42px');
  margin = input('0');
  fontSize = input('16px');

  keyUp = output<KeyboardEvent>();

  newPasswordType = output<'password' | 'text'>();

  onKeyUp(e: KeyboardEvent) {
    this.keyUp.emit(e);
  }

  togglePasswordVisibility() {
    if (!this.isPassword()) {
      return;
    }
    if (this.type() === 'password') {
      this.newPasswordType.emit('text');
    } else {
      this.newPasswordType.emit('password');
    }
  }
}
