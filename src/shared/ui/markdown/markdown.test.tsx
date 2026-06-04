// @vitest-environment jsdom
import { describe, it, expect, afterEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import Markdown from './markdown';

afterEach(cleanup);

describe('Markdown', () => {
  it('제목 마크다운을 heading 요소로 표시한다', () => {
    render(<Markdown>{'## 약관\n\n### 제1조'}</Markdown>);

    expect(screen.getByRole('heading', { level: 2, name: '약관' })).toBeTruthy();
    expect(
      screen.getByRole('heading', { level: 3, name: '제1조' }),
    ).toBeTruthy();
  });

  it('**굵게** 표기를 strong 요소로 강조한다', () => {
    render(<Markdown>{'본문 **중요** 표시'}</Markdown>);

    const strong = screen.getByText('중요');
    expect(strong.tagName).toBe('STRONG');
  });

  it('--- 구분선을 hr 요소로 표시한다', () => {
    const { container } = render(<Markdown>{'위\n\n---\n\n아래'}</Markdown>);

    expect(container.querySelector('hr')).not.toBeNull();
  });

  it('순서 목록을 항목 순서대로 표시한다', () => {
    render(<Markdown>{'1. 첫째\n2. 둘째\n3. 셋째'}</Markdown>);

    const items = screen.getAllByRole('listitem');
    expect(items.map((el) => el.textContent)).toEqual(['첫째', '둘째', '셋째']);
  });

  it('순서 항목 아래 들여쓴 불릿을 중첩 목록으로 표시한다', () => {
    render(
      <Markdown>{'1. 상위 항목\n   - 하위 A\n   - 하위 B'}</Markdown>,
    );

    expect(screen.getByText('하위 A').closest('ul')).not.toBeNull();
    expect(screen.getByText('하위 B').closest('ul')).not.toBeNull();
  });
});
