import { AssessmentCriteria } from './assessment-criteria';
import { AssessmentScore } from './assessment-score';

export class PlanDetails {
  planId: number;
  name: string;
  topic: string;
  topicEn: string;
  readinessWillingness: string;
  readinessWillingnessUpdatedAt: string;
  readinessWillingnessUpdatedBy: string;
  assessmentCriteria: AssessmentCriteria[];
  assessmentScore: AssessmentScore[];
  irGoalType?: string;
  irGoalTypeUpdatedAt?: string;
  irGoalTypeUpdatedBy?: string;
  irGoalDetails?: string;
  irGoalDetailsUpdatedAt?: string;
  irGoalDetailsUpdatedBy?: string;
  proposedActivity?: string;
  proposedActivityUpdatedAt?: string;
  proposedActivityUpdatedBy?: string;
  planNote?: string;
  planNoteUpdatedAt?: string;
  planNoteUpdatedBy?: string;
  contactPerson?: string;
  contactPersonUpdatedAt?: string;
  contactPersonUpdatedBy?: string;
  updatedAt?: string;
  updatedBy?: string;

  constructor() {}
}
