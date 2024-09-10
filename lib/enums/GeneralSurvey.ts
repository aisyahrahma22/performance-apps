export enum GeneralSurveyEnum {
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED',
}

export enum QuestionFreeTextTypeEnum {
  TEXT = 'TEXT',
  NUMBER = 'NUMBER',
}

export enum QuestionTypeFormatEnum {
  FREE_TEXT = 'FREE_TEXT',
  RATING = 'RATING',
  RANGE_SLIDER = 'RANGE_SLIDER',
  CHECKBOX = 'CHECKBOX',
  MULTIPLE_CHOICE = 'MULTIPLE_CHOICE',
  DROPDOWN = 'DROPDOWN',
  MULTIPLE_CHOICE_GRID = 'MULTIPLE_CHOICE_GRID',
}

export enum SurveyTypeEnum {
  GENERAL_SURVEY = 'GENERAL_SURVEY',
  LEARNING_EVALUATION = 'LEARNING_EVALUATION',
}

export enum SurveyParticipantStatusEnum {
  AVAILABLE = 'AVAILABLE',
  DRAFT = 'DRAFT',
  SUBMITTED = 'SUBMITTED',
  COMPLETED = 'COMPLETED',
  EXPIRED = 'EXPIRED',
}

export enum VisualResultQuestionTypeEnum {
  ROW = 'ROW',
  ROW_WITH_GROUP = 'ROW_WITH_GROUP',
  BAR_CHART = 'BAR_CHART',
  PIE_CHART = 'PIE_CHART',
}
