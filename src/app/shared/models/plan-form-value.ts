import { PlanScoreValue } from './plan-score-value';

export class PlanFormValue {
  readinessWillingness?: string;
  score?: PlanScoreValue;
  irGoalType?: string;
  irGoalDetails?: string;
  proposedActivity?: string;
  planNote?: string;
  contactPerson?: string;

  constructor() {}
}
