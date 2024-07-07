import { CommonModule } from '@angular/common';
import {
  Component,
  ElementRef,
  Renderer2,
  inject,
  input,
  signal,
  viewChild,
} from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { DropdownOption } from '../../shared/models/dropdown-option';

@Component({
  selector: 'app-com-select-dropdown',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './select-dropdown.component.html',
  styleUrl: './select-dropdown.component.scss',
})
export class SelectDropdownComponent {
  selectDropdownButton = viewChild<ElementRef>('selectDropdownButton');
  inputIcon = viewChild<ElementRef>('inputIcon');

  form = input<FormGroup>(new FormGroup({}));
  controlName = input<string>('');
  items = input.required<DropdownOption[]>();
  width = input('100%');
  height = input('30px');
  padding = input('8px 8px 8px 20px');
  placeholder = input('');
  disabled = input(false);
  onChange = input<() => void>();
  fontSize = input('20px');
  emptyMessage = input('');

  selectedDisplay = signal<string | number>('');
  showDropdown = signal(false);
  private listenerFn = signal(() => {});

  private subs = signal<Subscription[]>([]);

  private renderer: Renderer2 = inject(Renderer2);

  ngOnInit(): void {
    /*
    renderer.listen returns () => void.
    Which is an unsubscribe function to be used when component destroyed to unsubscribe registered event.
    */
    this.listenerFn.set(
      this.renderer.listen('window', 'click', (e: Event) => {
        if (
          e.target !== this.selectDropdownButton()?.nativeElement &&
          e.target !== this.inputIcon()?.nativeElement
        ) {
          this.hideDropdown();
        }
      })
    );

    // this.subs.update((values) => {
    //   values.push(
    //     this.control().valueChanges.subscribe((val) => {
    //       const match = this.items().find((item) => item.value === val);
    //       const display = match?.display || '';
    //       this.selectedDisplay.set(display);
    //     })
    //   );
    //   return values;
    // });
  }

  ngOnDestroy(): void {
    this.listenerFn();
    this.subs().forEach((s) => s.unsubscribe());
  }

  onInputClick(e: Event) {
    // toggle dropdown display
    if (this.disabled()) {
      return;
    }
    this.showDropdown.update((old) => !old);
  }

  onDropdownClicked() {
    this.hideDropdown();
  }

  onRadioValueChange() {
    // onChange from @Input()
    if (this.onChange) {
      this.onChange();
    }
  }

  private hideDropdown() {
    this.showDropdown.set(false);
  }
}
