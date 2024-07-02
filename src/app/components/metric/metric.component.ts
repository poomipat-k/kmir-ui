import { Component, signal } from '@angular/core';

@Component({
  selector: 'app-com-metric',
  standalone: true,
  imports: [],
  templateUrl: './metric.component.html',
  styleUrl: './metric.component.scss',
})
export class MetricComponent {
  protected gridItems = signal([...Array(100).keys()]);
}
