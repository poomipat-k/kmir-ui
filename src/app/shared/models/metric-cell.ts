import { MetricInput } from './metric-input';

export class MetricCell {
  name: string;
  data: MetricInput[];
  constructor(name: string, data: MetricInput[]) {
    this.name = name;
    this.data = data;
  }
}
