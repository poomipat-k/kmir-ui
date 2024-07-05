import { CommonModule } from '@angular/common';
import { Component, ElementRef, input, signal, viewChild } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
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

  control = input.required<FormControl>();
  items = input.required<DropdownOption[]>();
  width = input('100%');
  placeholder = input('');
  disabled = input(false);
  onChange = input<() => void>();
  dropdownFontSize = input('16px');
  emptyMessage = input('');

  showDropdown = signal(false);

  // ngOnInit(): void {
  //   /*
  //   renderer.listen returns () => void.
  //   Which is an unsubscribe function to be used when component destroyed to unsubscribe registered event.
  //   */
  //   this.listenerFn = this.renderer.listen('window', 'click', (e: Event) => {
  //     if (
  //       e.target !== this.selectDropdownButton?.nativeElement &&
  //       e.target !== this.inputIcon?.nativeElement
  //     ) {
  //       this.hideDropdown();
  //     }
  //   });
  // }

  // ngOnDestroy(): void {
  //   this.listenerFn();
  //   this.subs.forEach((s) => s.unsubscribe());
  // }

  onInputClick(e: Event) {
    // Check if the event target is really input element not the input icon
    if (
      !this.showDropdown() &&
      e.target === this.selectDropdownButton()?.nativeElement
    ) {
      this.showDropdown.set(true);
    }
  }

  onInputIconClick() {
    if (this.disabled()) {
      return;
    }
    if (this.showDropdown()) {
      this.hideDropdown();
    } else {
      this.showDropdown.set(true);
    }
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
