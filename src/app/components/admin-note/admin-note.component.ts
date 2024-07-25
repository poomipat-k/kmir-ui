import { Component, input } from '@angular/core';
import { SafeHtmlPipe } from '../../shared/pipe/safe-html.pipe';

@Component({
  selector: 'app-com-admin-note',
  standalone: true,
  imports: [SafeHtmlPipe],
  templateUrl: './admin-note.component.html',
  styleUrl: './admin-note.component.scss',
})
export class AdminNoteComponent {
  text = input.required<string>();
}
