import {
  Directive,
  ElementRef,
  HostListener,
  Renderer2,
  inject,
  input,
} from '@angular/core';

@Directive({
  selector: '[appTooltip]',
  standalone: true,
})
export class TooltipDirective {
  tooltipContent = input('');
  animationDuration = input(300);
  fadeOut = input(true);
  width = input('141px');

  private elRef: ElementRef = inject(ElementRef);
  private renderer: Renderer2 = inject(Renderer2);

  createTooltip(): HTMLElement {
    const tooltip: HTMLElement = this.renderer.createElement('div');
    const text = this.renderer.createText(this.tooltipContent());
    this.renderer.appendChild(tooltip, text);
    this.renderer.addClass(tooltip, 'appTooltip');
    this.renderer.setStyle(tooltip, 'width', this.width());

    // 0 ms won't work
    setTimeout(() => {
      this.renderer.addClass(tooltip, 'appTooltip--visible');
    }, 2);

    return tooltip;
  }

  @HostListener('mouseenter')
  onMouseEnter(): void {
    const tooltip = this.createTooltip();
    this.renderer.appendChild(this.elRef.nativeElement, tooltip);
  }

  @HostListener('mouseout')
  onMouseOut() {
    const tooltips = this.elRef.nativeElement.querySelectorAll('.appTooltip');

    setTimeout(() => {
      tooltips?.forEach((tooltip: any) => {
        this.renderer.removeClass(tooltip, 'appTooltip--visible');
      });
    }, 2);

    if (this.fadeOut()) {
      setTimeout(() => {
        tooltips?.forEach((tooltip: any) => {
          this.renderer.removeChild(this.elRef.nativeElement, tooltip);
        });
      }, this.animationDuration());
    } else {
      tooltips?.forEach((tooltip: any) => {
        this.renderer.removeChild(this.elRef.nativeElement, tooltip);
      });
    }
  }
  constructor() {}
}
