export class MetricInput {
  x: number;
  y: number;
  year: number;
  name: string;
  planId?: number;
  constructor(
    x: number,
    y: number,
    year: number,
    name: string,
    planId?: number
  ) {
    this.x = x;
    this.y = y;
    this.year = year;
    this.name = name;
    this.planId = planId;
  }
}
