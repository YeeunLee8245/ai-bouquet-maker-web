import { http, HttpResponse } from 'msw';

export const handlers = [
  // ── recipe/bouquet ──

  http.get('*/api/recipe/bouquet/list', () => {
    return HttpResponse.json({
      success: true,
      data: {
        items: [
          { id: 'bouquet-1', name: '봄 꽃다발', occasion: '생일', created_at: '2026-04-01T00:00:00Z' },
          { id: 'bouquet-2', name: '여름 꽃다발', occasion: '감사', created_at: '2026-04-02T00:00:00Z' },
        ],
        total: 2,
        page: 1,
        limit: 10,
      },
    });
  }),

  http.get('*/api/recipe/bouquet/:id', ({ params }) => {
    const { id } = params;
    if (id === 'not-found') {
      return HttpResponse.json({ success: false, message: 'Not found' }, { status: 404 });
    }
    return HttpResponse.json({
      success: true,
      data: {
        id,
        name: '테스트 꽃다발',
        occasion: '생일',
        recipient: '친구',
        message: '행복한 생일 되세요!',
        recipe: {
          flowers: [{ flower_id: 'f1', flower_meaning_id: 'm1', quantity: 3, color: '빨강' }],
          wrapping: { ribbonColor: '#fff', wrappingColor: '#f0f' },
        },
      },
    });
  }),

  http.post('*/api/recipe/bouquet', () => {
    return HttpResponse.json({
      success: true,
      data: { id: 'new-bouquet-id' },
    });
  }),

  http.put('*/api/recipe/bouquet/:id', () => {
    return new HttpResponse(null, { status: 204 });
  }),

  http.delete('*/api/recipe/bouquet/:id', () => {
    return new HttpResponse(null, { status: 204 });
  }),

  // ── flowers/like ──

  http.post('*/api/flowers/:id/like', () => {
    return HttpResponse.json({ isLiked: true });
  }),

  http.delete('*/api/flowers/:id/like', () => {
    return HttpResponse.json({ isLiked: false });
  }),
];
