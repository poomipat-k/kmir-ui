import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  inject,
  input,
  output,
  signal,
  viewChild,
} from '@angular/core';

@Component({
  selector: 'app-com-modal',
  standalone: true,
  imports: [],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.scss',
})
export class ModalComponent {
  modal = viewChild<ElementRef>('modal');

  width = input('');
  height = input('');
  padding = input('');

  modalCloseEvent = output();

  displayModal = signal(false);

  changeDetectorRef: ChangeDetectorRef = inject(ChangeDetectorRef);

  ngOnDestroy(): void {
    this.closeModal();
  }

  showModal() {
    this.displayModal.set(true);
    this.changeDetectorRef.detectChanges();

    document.body.style.overflow = 'hidden';
    this.modal()?.nativeElement?.focus();
  }

  closeModal() {
    this.displayModal.set(false);
    document.body.style.overflow = '';
    this.modalCloseEvent.emit();
  }

  onBackdropClicked() {
    this.closeModal();
  }

  onKeyUp(event: any) {
    // when esc key pressed
    if (event?.keyCode === 27) {
      this.closeModal();
    }
  }
}
