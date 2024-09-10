import { QuestionTypeFormatEnum } from "../lib/enums/GeneralSurvey";

export const surveyFormatOptions = [
  {
    key: QuestionTypeFormatEnum.FREE_TEXT,
    text: 'Free Input',
    value: QuestionTypeFormatEnum.FREE_TEXT
  },
  {
    key: QuestionTypeFormatEnum.RATING,
    text: 'Rating',
    value: QuestionTypeFormatEnum.RATING
  },
  {
    key: QuestionTypeFormatEnum.RANGE_SLIDER,
    text: 'Range Slider',
    value: QuestionTypeFormatEnum.RANGE_SLIDER
  },
  {
    key: QuestionTypeFormatEnum.CHECKBOX,
    text: 'Checkbox',
    value: QuestionTypeFormatEnum.CHECKBOX
  },
  {
    key: QuestionTypeFormatEnum.DROPDOWN,
    text: 'Dropdown',
    value: QuestionTypeFormatEnum.DROPDOWN
  },
  {
    key: QuestionTypeFormatEnum.MULTIPLE_CHOICE,
    text: 'Multiple Choice',
    value: QuestionTypeFormatEnum.MULTIPLE_CHOICE
  },
  {
    key: QuestionTypeFormatEnum.MULTIPLE_CHOICE_GRID,
    text: 'Multiple Choice Grid',
    value: QuestionTypeFormatEnum.MULTIPLE_CHOICE_GRID
  },
]