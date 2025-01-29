import { Component, viewChild } from '@angular/core';
import { ModalComponent } from '../modal/modal.component';
import { ScoreDetailsTableComponent } from '../score-details-table/score-details-table.component';

@Component({
  selector: 'app-com-score-details-link',
  standalone: true,
  imports: [ModalComponent, ScoreDetailsTableComponent],
  templateUrl: './score-details-link.component.html',
  styleUrl: './score-details-link.component.scss',
})
export class ScoreDetailsLinkComponent {
  modal = viewChild<ModalComponent>('modal');

  showModal() {
    this.modal()?.showModal();
  }

  closeModal() {
    this.modal()?.closeModal();
  }
}
