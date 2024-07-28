import { Component, input } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { SafeHtmlPipe } from '../../shared/pipe/safe-html.pipe';
import { CustomEditorComponent } from '../custom-editor/custom-editor.component';

@Component({
  selector: 'app-com-admin-note',
  standalone: true,
  imports: [SafeHtmlPipe, ReactiveFormsModule, CustomEditorComponent],
  templateUrl: './admin-note.component.html',
  styleUrl: './admin-note.component.scss',
})
export class AdminNoteComponent {
  text = input<string>('');
  editMode = input(false);
  control = input(new FormControl());
}
