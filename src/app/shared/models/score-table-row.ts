export class ScoreTableRow {
  order: number;
  score?: number;
  question?: string;
  planId?: number;
  constructor(
    order: number,
    score?: number,
    question?: string,
    planId?: number
  ) {
    this.order = order;
    this.score = score;
    this.question = question;
    this.planId = planId;
  }
}
