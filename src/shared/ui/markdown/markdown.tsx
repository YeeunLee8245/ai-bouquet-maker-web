import { cn } from '@/shared/utils/styles';
import { parseMarkdown } from './parse-markdown';

type TProps = {
  children: string;
  className?: string;
};

/**
 * 마크다운 문자열을 디자인 시스템 타이포그래피에 맞춰 렌더링한다.
 * 약관·개인정보 처리방침 등 신뢰된 정적 마크다운 콘텐츠 표시에 사용한다.
 * 외부 라이브러리 없이 동작하는 경량 렌더러다.
 */
export default function Markdown({ children, className }: TProps) {
  return (
    <div
      className={cn(
        'flex flex-col gap-3 text-body-md text-gray-400',
        className,
      )}
    >
      {parseMarkdown(children)}
    </div>
  );
}
