export class ScoreTableRow {
  order: number;
  score?: number;
  question?: string;
  constructor(order: number, score?: number, question?: string) {
    this.order = order;
    this.score = score;
    this.question = question;
  }
}
