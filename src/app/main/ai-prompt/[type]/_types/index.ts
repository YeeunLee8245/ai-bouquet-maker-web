import { AI_PROMPT_DATAS } from '../_datas';

export type AIPromptType = (typeof AI_PROMPT_DATAS)[number];

export interface IAIPromptGuide {
  title: string;
  description?: string;
  items: string[];
}

export interface IAIPromptData {
  title: string;
  description: string;
  placeholder: string;
  guide: IAIPromptGuide;
}

export type TAIPromptDataMapType = {
  [K in AIPromptType]: IAIPromptData;
};

export interface IAIPromptPageParams {
  type: AIPromptType;
  [key: string]: string | string[] | undefined;
}

export interface IAIPromptEventHub {
  onClickGuideItem?: (item: string) => void;
  getInputText?: () => string;
}
