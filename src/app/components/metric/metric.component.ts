import { CommonModule } from '@angular/common';
import { Component, computed, input } from '@angular/core';
import { TooltipDirective } from '../../shared/directives/tooltip.directive';
import { MetricCell } from '../../shared/models/metric-cell';
import { MetricInput } from '../../shared/models/metric-input';

@Component({
  selector: 'app-com-metric',
  standalone: true,
  imports: [CommonModule, TooltipDirective],
  templateUrl: './metric.component.html',
  styleUrl: './metric.component.scss',
})
export class MetricComponent {
  xLabel = input<string>('Willingness');
  yLabel = input<string>('Capacity');
  data = input<MetricInput[]>([]);
  size = input('small');

  protected gridItems = computed(() => this.handleDataChanged());
  private readonly originalGridPos = [
    ['g', 'g', 'g', 'h', 'h', 'h', 'i', 'i', 'i', 'i'],
    ['g', 'g', 'g', 'h', 'h', 'h', 'i', 'i', 'i', 'i'],
    ['g', 'g', 'g', 'h', 'h', 'h', 'i', 'i', 'i', 'i'],
    ['g', 'g', 'g', 'h', 'h', 'h', 'i', 'i', 'i', 'i'],
    ['d', 'd', 'd', 'e', 'e', 'e', 'f', 'f', 'f', 'f'],
    ['d', 'd', 'd', 'e', 'e', 'e', 'f', 'f', 'f', 'f'],
    ['d', 'd', 'd', 'e', 'e', 'e', 'f', 'f', 'f', 'f'],
    ['a', 'a', 'a', 'b', 'b', 'b', 'c', 'c', 'c', 'c'],
    ['a', 'a', 'a', 'b', 'b', 'b', 'c', 'c', 'c', 'c'],
    ['a', 'a', 'a', 'b', 'b', 'b', 'c', 'c', 'c', 'c'],
  ];

  constructor() {}

  handleDataChanged() {
    const metricInput = this.data();
    const rowCount = this.originalGridPos.length;
    const cellGrid: MetricCell[][] = this.originalGridPos.map((row) =>
      row.map((s) => new MetricCell(s, []))
    );

    metricInput.forEach((item) => {
      const [row, col] = [rowCount - item.y, item.x - 1];
      cellGrid[row][col].name = 'active';
      cellGrid[row][col].data.push(item);
    });
    return cellGrid;
  }

  getTooltipContent(cell: MetricCell) {
    let res: string[] = [];
    cell.data?.forEach((yearData) => {
      res.push(`\u2022 ${yearData.name} (${yearData.year + 543})\n`);
    });
    return res.join('');
  }

  getItemArea(item: string) {
    return item;
  }
}
