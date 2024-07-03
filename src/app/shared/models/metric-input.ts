export class MetricInput {
  x: number;
  y: number;
  year: number;
  name: string;
  constructor(x: number, y: number, year: number, name: string) {
    this.x = x;
    this.y = y;
    this.year = year;
    this.name = name;
  }
}
