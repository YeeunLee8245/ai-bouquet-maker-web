import { AIPromptDataMapType } from '../_types';

export const AI_PROMPT_DATAS = ['emotion', 'recipient'] as const;

export const AI_PROMPT_DATA_MAP: AIPromptDataMapType = {
  emotion: {
    title: '전하고 싶은 마음이 있나요?',
    description: '상대를 향한 감정을 자유롭게 표현해 주세요.\nAI가 분석해 가장 적합한 꽃을 추천해 드려요.',
    placeholder: '예: 오랫동안 고마웠다는 마음을 전하고 싶어요. 부담스럽지 않으면서 진심이 느껴졌으면 좋겠어요.',
    guide: {
      title: '이런 마음을 표현해도 좋아요.',
      items: [
        '여자친구와 100일을 맞아 사랑하는 마음을 전하고 싶어요.',
        '시험에 합격한 친구를 축하해 주고 싶어요.',
        '졸업식 때 선생님께 감사 인사를 전하고 싶어요.',
      ],
    },
  },
  recipient: {
    title: '누구에게 선물하시나요?',
    description: '받는 분에 관해 알려 주세요!\n그 분에게 가장 어울리는 꽃을 추천해 드릴게요.',
    placeholder: '예: 30대 초반 여동생, 차분하고 지적인 성격이며 보라색과 흰색을 좋아해요. 대학원 졸업 축하 선물로 주려고 해요.',
    guide: {
      title: '다음 정보를 포함하면 더 정확한\n추천을 받을 수 있어요.',
      items: [
        '나이대와 성별',
        '성격이나 분위기',
        '좋아하는 색상',
        '관계 (가족, 연인, 친구, 동료 등)',
        '특별한 상황이나 행사',
      ],
    },
  },
};
