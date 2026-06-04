import { Fragment, type ReactNode } from 'react';

/**
 * 약관·개인정보 처리방침 등 정적 콘텐츠가 사용하는 마크다운 부분집합만 파싱한다.
 * 지원: 제목(`#`~`###`), 구분선(`---`), 굵게(`**`), 순서/비순서 목록(1단계 중첩).
 * 외부 라이브러리 없이 동작하며, 신뢰된 정적 문자열에만 사용한다.
 */
export function parseMarkdown(source: string): ReactNode {
  const lines = source.split('\n');
  return <>{parseBlocks(lines, 'md')}</>;
}

/** `**굵게**` 인라인 마크업을 React 노드로 변환한다. */
function renderInline(text: string): ReactNode[] {
  return text.split(/(\*\*[^*]+\*\*)/g).map((part, idx) => {
    const bold = part.match(/^\*\*([^*]+)\*\*$/);
    if (bold) {
      return (
        <strong key={idx} className='font-semibold text-gray-700'>
          {bold[1]}
        </strong>
      );
    }
    return <Fragment key={idx}>{part}</Fragment>;
  });
}

const HEADING_CLASS: Record<number, string> = {
  1: 'text-title-lg text-gray-700',
  2: 'text-title-md text-gray-700',
  3: 'text-ui-lg font-semibold text-gray-700 mt-1',
};

/** 라인 배열을 블록 단위(제목·구분선·목록·문단)로 파싱한다. */
function parseBlocks(lines: string[], keyPrefix: string): ReactNode[] {
  const blocks: ReactNode[] = [];
  let paragraph: string[] = [];
  let key = 0;

  const flushParagraph = () => {
    if (paragraph.length === 0) {
      return;
    }
    blocks.push(
      <p
        key={`${keyPrefix}-p${key++}`}
        className='text-body-md text-gray-400 leading-relaxed'
      >
        {renderInline(paragraph.join(' '))}
      </p>,
    );
    paragraph = [];
  };

  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    const trimmed = line.trim();

    if (trimmed === '') {
      flushParagraph();
      i++;
      continue;
    }

    if (trimmed === '---') {
      flushParagraph();
      blocks.push(
        <hr
          key={`${keyPrefix}-hr${key++}`}
          className='border-0 border-t border-gray-100'
        />,
      );
      i++;
      continue;
    }

    const heading = trimmed.match(/^(#{1,3})\s+(.*)$/);
    if (heading) {
      flushParagraph();
      const level = heading[1].length;
      const Tag = `h${level}` as 'h1' | 'h2' | 'h3';
      blocks.push(
        <Tag key={`${keyPrefix}-h${key++}`} className={HEADING_CLASS[level]}>
          {renderInline(heading[2])}
        </Tag>,
      );
      i++;
      continue;
    }

    // 들여쓰기 없는 `1.` → 순서 목록
    if (/^\d+\.\s+/.test(line)) {
      flushParagraph();
      const result = parseOrderedList(lines, i, `${keyPrefix}-ol${key++}`);
      blocks.push(result.node);
      i = result.next;
      continue;
    }

    // 들여쓰기 없는 `-` → 비순서 목록
    if (/^-\s+/.test(line)) {
      flushParagraph();
      const result = parseUnorderedList(lines, i, `${keyPrefix}-ul${key++}`);
      blocks.push(result.node);
      i = result.next;
      continue;
    }

    paragraph.push(trimmed);
    i++;
  }

  flushParagraph();
  return blocks;
}

type TOrderedItem = { text: string; childLines: string[] };

/**
 * 순서 목록을 파싱한다. 들여쓰기된 라인(중첩 `-` 불릿·이어지는 문단)은
 * 직전 항목의 자식으로 모아 재귀 파싱한다.
 */
function parseOrderedList(
  lines: string[],
  start: number,
  keyPrefix: string,
): { node: ReactNode; next: number } {
  const items: TOrderedItem[] = [];
  let i = start;

  while (i < lines.length) {
    const line = lines[i];
    const ordered = line.match(/^(\d+)\.\s+(.*)$/);

    if (ordered && !/^\s/.test(line)) {
      items.push({ text: ordered[2], childLines: [] });
      i++;
      continue;
    }

    if (/^\s+\S/.test(line) && items.length > 0) {
      items[items.length - 1].childLines.push(line.replace(/^\s+/, ''));
      i++;
      continue;
    }

    if (line.trim() === '' && items.length > 0) {
      const next = lines[i + 1] ?? '';
      // 다음 라인이 목록의 연속이면 빈 줄을 자식 문단 구분자로 유지한다.
      if (/^\d+\.\s/.test(next) || /^\s+\S/.test(next)) {
        items[items.length - 1].childLines.push('');
        i++;
        continue;
      }
    }

    break;
  }

  const node = (
    <ol key={keyPrefix} className='list-decimal pl-5 flex flex-col gap-1'>
      {items.map((item, idx) => (
        <li
          key={`${keyPrefix}-li${idx}`}
          className='text-body-md text-gray-400 leading-relaxed'
        >
          {renderInline(item.text)}
          {item.childLines.length > 0 && (
            <div className='mt-1 flex flex-col gap-1'>
              {parseBlocks(item.childLines, `${keyPrefix}-li${idx}`)}
            </div>
          )}
        </li>
      ))}
    </ol>
  );

  return { node, next: i };
}

/** 들여쓰기 없는 `-` 불릿이 연속되는 비순서 목록을 파싱한다. */
function parseUnorderedList(
  lines: string[],
  start: number,
  keyPrefix: string,
): { node: ReactNode; next: number } {
  const items: string[] = [];
  let i = start;

  while (i < lines.length) {
    const line = lines[i];
    const bullet = line.match(/^-\s+(.*)$/);

    if (bullet) {
      items.push(bullet[1]);
      i++;
      continue;
    }

    if (line.trim() === '' && /^-\s+/.test(lines[i + 1] ?? '')) {
      i++;
      continue;
    }

    break;
  }

  const node = (
    <ul key={keyPrefix} className='list-disc pl-5 flex flex-col gap-1'>
      {items.map((text, idx) => (
        <li
          key={`${keyPrefix}-li${idx}`}
          className='text-body-md text-gray-400 leading-relaxed'
        >
          {renderInline(text)}
        </li>
      ))}
    </ul>
  );

  return { node, next: i };
}
