import {
  Directive,
  ElementRef,
  OnDestroy,
  OnInit,
  inject,
  input,
  output,
} from '@angular/core';
import { Observable, Subscription, debounceTime } from 'rxjs';

@Directive({
  selector: '[appIntersectionElement]',
  standalone: true,
})
export class IntersectionElementDirective implements OnInit, OnDestroy {
  root = input<HTMLElement | null>(null);
  rootMargin = input('0px 0px 0px 0px');
  threshold = input(0);
  debounceTime = input(0);
  isContinuous = input(true);

  isIntersecting = output<boolean>();

  _isIntersecting = false;
  subscription: Subscription;

  private readonly element: ElementRef = inject(ElementRef);

  ngOnInit() {
    this.subscription = this.createAndObserve();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  createAndObserve() {
    const options: IntersectionObserverInit = {
      root: this.root(),
      rootMargin: this.rootMargin(),
      threshold: this.threshold(),
    };

    return new Observable<boolean>((subscriber) => {
      const intersectionObserver = new IntersectionObserver((entries) => {
        const { isIntersecting } = entries[0];
        subscriber.next(isIntersecting);

        isIntersecting &&
          !this.isContinuous &&
          intersectionObserver.disconnect();
      }, options);

      intersectionObserver.observe(this.element.nativeElement);

      return {
        unsubscribe() {
          intersectionObserver.disconnect();
        },
      };
    })
      .pipe(debounceTime(this.debounceTime()))
      .subscribe((status) => {
        this.isIntersecting.emit(status);
        this._isIntersecting = status;
      });
  }

  constructor() {}
}
