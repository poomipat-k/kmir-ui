import { Component, input } from '@angular/core';

@Component({
  selector: 'app-com-updated-at',
  standalone: true,
  imports: [],
  templateUrl: './updated-at.component.html',
  styleUrl: './updated-at.component.scss',
})
export class UpdatedAtComponent {
  display = input.required<string>();
}
