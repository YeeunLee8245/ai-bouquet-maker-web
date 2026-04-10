// @vitest-environment jsdom
import { describe, it, expect, vi, beforeAll, afterAll, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor, cleanup } from '@testing-library/react';
import { createStore, Provider } from 'jotai';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { http, HttpResponse } from 'msw';
import { server } from '@shared/mocks/server';
import LikeButton from './like-button';

// SVG 컴포넌트 mock (Vitest는 SVGR 변환을 수행하지 않으므로)
vi.mock('@/shared/assets/icons/fill_heart.svg', () => ({
  default: ({ className }: { className?: string }) => <svg data-testid='fill-heart' className={className} />,
}));
vi.mock('@/shared/assets/icons/outline_heart.svg', () => ({
  default: ({ className }: { className?: string }) => <svg data-testid='outline-heart' className={className} />,
}));

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
afterEach(() => {
  server.resetHandlers();
  cleanup();
});
afterAll(() => server.close());

function renderLikeButton(props: Partial<Parameters<typeof LikeButton>[0]> = {}) {
  const store = createStore();
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });

  const defaultProps = {
    type: 'flower' as const,
    id: 'flower-1',
    variant: 'outline' as const,
    size: 'md' as const,
    ...props,
  };

  return {
    store,
    queryClient,
    ...render(
      <QueryClientProvider client={queryClient}>
        <Provider store={store}>
          <LikeButton {...defaultProps} />
        </Provider>
      </QueryClientProvider>,
    ),
  };
}

describe('LikeButton', () => {
  // ── Happy Path ──

  it('초기 상태(미좋아요)로 렌더링된다', () => {
    renderLikeButton();
    const button = screen.getByRole('button', { name: '좋아요' });
    expect(button).toBeTruthy();
    expect(button.getAttribute('aria-pressed')).toBe('false');
  });

  it('좋아요 클릭 후 API가 성공하면 aria-pressed가 true로 변경된다', async () => {
    renderLikeButton();
    const button = screen.getByRole('button', { name: '좋아요' });

    fireEvent.click(button);

    await waitFor(() => {
      expect(button.getAttribute('aria-pressed')).toBe('true');
    });
  });

  it('pending 상태에서는 버튼이 비활성화된다', async () => {
    renderLikeButton();
    const button = screen.getByRole('button', { name: '좋아요' });

    fireEvent.click(button);

    // 클릭 직후 pending (optimistic update)
    expect((button as HTMLButtonElement).disabled).toBe(true);
  });

  // ── Error Case ──

  it('API 실패 시 좋아요 상태가 롤백된다', async () => {
    server.use(
      http.post('*/api/flowers/:id/like', () => {
        return HttpResponse.json({ message: 'Server Error' }, { status: 500 });
      }),
    );

    renderLikeButton();
    const button = screen.getByRole('button', { name: '좋아요' });

    fireEvent.click(button);

    await waitFor(() => {
      // 에러 후 롤백 → aria-pressed 다시 false
      expect(button.getAttribute('aria-pressed')).toBe('false');
    });
  });

  // ── Edge Case ──

  it('pending 중 연속 클릭은 무시된다', async () => {
    let callCount = 0;
    server.use(
      http.post('*/api/flowers/:id/like', async () => {
        callCount++;
        await new Promise((r) => setTimeout(r, 100));
        return HttpResponse.json({ isLiked: true });
      }),
    );

    renderLikeButton();
    const button = screen.getByRole('button', { name: '좋아요' });

    fireEvent.click(button); // 첫 번째 클릭
    fireEvent.click(button); // pending 중 두 번째 클릭 → 무시
    fireEvent.click(button); // pending 중 세 번째 클릭 → 무시

    await waitFor(() => {
      expect(callCount).toBe(1);
    });
  });
});
