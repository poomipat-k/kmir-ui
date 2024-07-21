export class DropdownOption {
  value: any;
  display?: string | number;

  constructor(value: any, display?: string | number) {
    this.value = value;
    this.display = display;
  }
}
