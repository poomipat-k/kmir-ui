import { AssessmentCriteria } from './assessment-criteria';
import { LatestScore } from './latest-score';
import { PlanDetails } from './plan-details';

export class AdminAllPlans {
  assessmentCriteria: AssessmentCriteria[];
  planDetails: PlanDetails[];
  adminNote: string;
  latestScores: LatestScore[];

  constructor() {}
}
