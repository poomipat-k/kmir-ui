import { CommonModule } from '@angular/common';
import {
  Component,
  ElementRef,
  Input,
  Renderer2,
  ViewChild,
  inject,
} from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-com-select-dropdown-v2',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './select-dropdown-v2.component.html',
  styleUrl: './select-dropdown-v2.component.scss',
})
export class SelectDropdownV2Component {
  @ViewChild('inputIcon') inputIcon: ElementRef;
  @ViewChild('selectDropdownButton') selectDropdownButton: ElementRef;

  @Input() items: any[] = [];
  @Input() form: FormGroup;
  @Input() controlName = '';
  @Input() placeholder = 'เลือกการค้นหา';
  @Input() dropdownFontSize = '16px';
  @Input() width = '28.6rem';
  @Input() emptyMessage = 'ไม่พบข้อมูล';
  @Input() disabled = false;
  @Input() onChange: () => void;

  // selectDropdownButton = viewChild<ElementRef>('selectDropdownButton');
  // inputIcon = viewChild<ElementRef>('inputIcon');

  // control = input.required<FormControl>();
  // items = input.required<DropdownOption[]>();
  // form = input<FormGroup>();

  // width = input('100%');
  // height = input('30px');
  // padding = input('8px 8px 8px 20px');
  // placeholder = input('');
  // disabled = input(false);
  // onChange = input<() => void>(() => {});
  // fontSize = input('20px');
  // emptyMessage = input('');

  // selectedDisplay = signal<string | number>('');
  // showDropdown = signal(false);

  private readonly subs: Subscription[] = [];

  private listenerFn = () => {};

  private renderer: Renderer2 = inject(Renderer2);

  protected showDropdown = false;
  protected searchText = '';

  get filteredOptions(): any[] {
    const options = this.items.filter((item) =>
      item.display.toString()?.includes(this.searchText)
    );

    return options;
  }

  get inputValue() {
    if (!this.showDropdown) {
      const display = this.items.find(
        (item) => item.value === this.form.get(this.controlName)?.value
      )?.display;
      return display || '';
    }
    return this.searchText;
  }

  ngOnInit(): void {
    /*
    renderer.listen returns () => void. 
    Which is an unsubscribe function to be used when component destroyed to unsubscribe registered event.
    */
    this.listenerFn = this.renderer.listen('window', 'click', (e: Event) => {
      if (
        e.target !== this.selectDropdownButton?.nativeElement &&
        e.target !== this.inputIcon?.nativeElement
      ) {
        this.hideDropdown();
      }
    });
  }

  ngOnDestroy(): void {
    this.listenerFn();
    this.subs.forEach((s) => s.unsubscribe());
  }

  onSearchChanged(event: any) {
    this.searchText = event.target.value;
  }

  onInputClick(e: Event) {
    this.showDropdown = !this.showDropdown;
  }

  onInputIconClick() {
    if (this.disabled) {
      return;
    }
    if (this.showDropdown) {
      this.hideDropdown();
    } else {
      this.showDropdown = true;
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
    this.showDropdown = false;
    this.searchText = '';
  }
}
