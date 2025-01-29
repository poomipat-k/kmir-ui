import { animate, style, transition, trigger } from '@angular/animations';
import { CommonModule } from '@angular/common';
import { Component, input } from '@angular/core';

@Component({
  selector: 'app-com-popup',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './popup.component.html',
  styleUrl: './popup.component.scss',
  animations: [
    trigger('popup', [
      transition(':enter', [
        style({
          opacity: 0,
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%) scale(0)',
        }),
        animate(
          '300ms ease-out',
          style({
            opacity: 1,
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%) scale(1)',
          })
        ),
      ]),
      transition(':leave', [
        style({
          opacity: 1,
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%) scale(1)',
        }),
        animate(
          '300ms ease-out',
          style({
            opacity: 0,
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%) scale(0)',
          })
        ),
      ]),
    ]),
  ],
})
export class PopupComponent {
  show = input.required<boolean>();
  error = input(false);
  displayText = input('');
  width = input('240px');
}
