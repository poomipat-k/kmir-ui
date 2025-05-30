import { CommonModule } from '@angular/common';
import { Component, OnInit, input, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { EditorComponent, TINYMCE_SCRIPT_SRC } from '@tinymce/tinymce-angular';

@Component({
  selector: 'app-com-custom-editor',
  standalone: true,
  imports: [EditorComponent, ReactiveFormsModule, CommonModule],
  providers: [
    { provide: TINYMCE_SCRIPT_SRC, useValue: 'tinymce/tinymce.min.js' },
  ],
  templateUrl: './custom-editor.component.html',
  styleUrl: './custom-editor.component.scss',
})
export class CustomEditorComponent implements OnInit {
  control = input(new FormControl());
  height = input(326);
  hasError = input(false);

  protected editorInit = signal<EditorComponent['init']>({});
  protected editorPlugins = signal(
    'preview autolink autosave save code visualblocks visualchars fullscreen link media codesample table charmap nonbreaking anchor lists advlist wordcount help charmap emoticons'
  );
  protected editorToolbar = signal(
    'undo redo | blocks fontsize fontfamily lineheight | bold italic underline strikethrough | align numlist bullist | link | table media | outdent indent| forecolor backcolor removeformat | charmap emoticons | code fullscreen preview | save print | anchor codesample'
  );

  ngOnInit(): void {
    this.initRichTextEditor();
  }

  private initRichTextEditor() {
    this.editorInit.set({
      base_url: '/tinymce',
      suffix: '.min',
      font_size_formats:
        '10px 12px 13px 14px 16px 18px 20px 24px 28px 32px 48px',
      line_height_formats:
        '10px 16px 18px 20px 24px 26px 27px 30px 33px 36px 39px 44px 48px 52px',
      block_unsupported_drop: true,
      paste_block_drop: true,
      height: this.height(),
      font_family_formats: 'IBM Plex Sans Thai Looped, sans-serif',

      content_style:
        "@import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Thai+Looped:wght@400;500;600&display=swap'); body { font-family: 'IBM Plex Sans Thai Looped', sans-serif; }",
    });
  }
}
