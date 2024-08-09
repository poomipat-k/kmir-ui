import { Component, input } from '@angular/core';
import { TooltipDirective } from '../../shared/directives/tooltip.directive';

@Component({
  selector: 'app-com-icon-tooltip',
  standalone: true,
  imports: [TooltipDirective],
  templateUrl: './icon-tooltip.component.html',
  styleUrl: './icon-tooltip.component.scss',
})
export class IconTooltipComponent {
  hasTooltip = input(false);
  tooltipText = input<string>('');
  width = input('141px');
}
