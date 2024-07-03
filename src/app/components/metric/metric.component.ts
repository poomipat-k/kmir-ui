import { CommonModule } from '@angular/common';
import { Component, computed, input } from '@angular/core';
import { MetricInput } from '../../shared/models/metric-input';

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
  data = input<MetricInput[]>([
    // {
    //   x: 5,
    //   y: 7,
    //   year: 2022,
    //   name: 'Alcohol',
    // },
    // {
    //   x: 5,
    //   y: 7,
    //   year: 2023,
    //   name: 'Alcohol',
    // },
    // {
    //   x: 10,
    //   y: 9,
    //   year: 2024,
    //   name: 'Alcohol',
    // },
  ]);

  protected gridItems = computed(() => this.handleDataChanged());

  constructor() {
    // this.handleDataChanged = this.handleDataChanged.bind(this);
  }

  handleDataChanged() {
    console.log('==data()', this.data());
    const data = this.data();
    const original = [
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
    const rowCount = original.length;
    data.forEach((item) => {
      const [row, col] = [rowCount - item.y, item.x - 1];
      original[row][col] = 'active';
    });
    return original;
  }

  getItemArea(item: string) {
    return item;
  }
}
