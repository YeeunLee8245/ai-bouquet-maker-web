import { describe, it, expect, beforeAll, afterAll, afterEach } from 'vitest';
import { http, HttpResponse } from 'msw';
import { server } from '@shared/mocks/server';
import { postLike, deleteLike } from './like-api';

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('postLike', () => {
  // ── Happy Path ──

  it('좋아요 성공 시 true를 반환한다', async () => {
    const result = await postLike('flower-1');
    expect(result).toBe(true);
  });

  // ── Error Case ──

  it('401 응답 시 예외를 던진다', async () => {
    server.use(
      http.post('*/api/flowers/:id/like', () => {
        return HttpResponse.json({ message: 'Unauthorized' }, { status: 401 });
      }),
    );

    await expect(postLike('flower-1')).rejects.toThrow();
  });

  it('서버 에러(500) 시 예외를 던진다', async () => {
    server.use(
      http.post('*/api/flowers/:id/like', () => {
        return HttpResponse.json({ message: 'Server Error' }, { status: 500 });
      }),
    );

    await expect(postLike('flower-1')).rejects.toThrow();
  });
});

describe('deleteLike', () => {
  // ── Happy Path ──

  it('좋아요 취소 성공 시 false를 반환한다', async () => {
    const result = await deleteLike('flower-1');
    expect(result).toBe(false);
  });

  // ── Error Case ──

  it('401 응답 시 예외를 던진다', async () => {
    server.use(
      http.delete('*/api/flowers/:id/like', () => {
        return HttpResponse.json({ message: 'Unauthorized' }, { status: 401 });
      }),
    );

    await expect(deleteLike('flower-1')).rejects.toThrow();
  });

  // ── Edge Case ──

  it('응답 본문에 isLiked 없을 때 undefined를 반환한다', async () => {
    server.use(
      http.delete('*/api/flowers/:id/like', () => {
        return HttpResponse.json({});
      }),
    );

    const result = await deleteLike('flower-1');
    expect(result).toBeUndefined();
  });
});
