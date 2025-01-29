import { Component, input } from '@angular/core';

@Component({
  selector: 'app-com-instruction-note',
  standalone: true,
  imports: [],
  templateUrl: './instruction-note.component.html',
  styleUrl: './instruction-note.component.scss',
})
export class InstructionNoteComponent {
  label = input('ข้อแนะนำการใช้งาน: ');
  text = input('');
  remark = input('');
  fontSize = input('16px');
  editorGuide = input(false);
}
