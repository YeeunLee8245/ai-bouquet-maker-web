import { AI_PROMPT_DATAS } from '../_datas';

export type AIPromptType = (typeof AI_PROMPT_DATAS)[number];

export interface AIPromptGuide {
  title: string;
  description?: string;
  items: string[];
}

export interface AIPromptData {
  title: string;
  description: string;
  placeholder: string;
  guide: AIPromptGuide;
}

export type AIPromptDataMapType = {
  [K in AIPromptType]: AIPromptData;
};

export interface AIPromptPageParams {
  type: AIPromptType;
  [key: string]: string | string[] | undefined;
}

export interface AIPromptEventHub {
  onClickGuideItem?: (item: string) => void;
  getInputText?: () => string;
}
