import { CommonModule } from '@angular/common';
import { Component, input, signal } from '@angular/core';

@Component({
  selector: 'app-com-metric',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './metric.component.html',
  styleUrl: './metric.component.scss',
})
export class MetricComponent {
  xLabel = input<string>('Willingness');
  yLabel = input<string>('Capacity');

  protected gridItems = signal([
    'g g g h h h i i i i',
    'g g g h h h i i i i',
    'g g g h h h i i i i',
    'g g g h h h i i i i',
    'd d d e e e f f f f',
    'd d d e e e f f f f',
    'd d d e e e f f f f',
    'a a a b b b c c c c',
    'a a a b b b c c c c',
    'a a a b b b c c c c',
  ]);

  getItemArea(item: string) {
    return item;
  }
}
