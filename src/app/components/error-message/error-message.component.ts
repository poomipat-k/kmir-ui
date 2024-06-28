import { Component, input } from '@angular/core';

@Component({
  selector: 'app-com-error-message',
  standalone: true,
  imports: [],
  templateUrl: './error-message.component.html',
  styleUrl: './error-message.component.scss',
})
export class ErrorMessageComponent {
  text = input('');
  marginTop = input('0px');
}
