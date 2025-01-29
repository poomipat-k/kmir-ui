import { ViewportScroller } from '@angular/common';
import { Component, inject } from '@angular/core';

@Component({
  selector: 'app-com-back-to-top',
  standalone: true,
  imports: [],
  templateUrl: './back-to-top.component.html',
  styleUrl: './back-to-top.component.scss',
})
export class BackToTopComponent {
  private readonly scroller: ViewportScroller = inject(ViewportScroller);

  onClick() {
    this.scroller.scrollToPosition([0, 0]);
  }
}
