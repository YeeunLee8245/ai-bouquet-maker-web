// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { createStore, Provider } from 'jotai';
import ColorPaletteModal, { PRESET_COLORS } from './color-palette-modal';
import { toastListAtom } from '@/shared/model/toast';

function renderWithStore(ui: React.ReactElement, store = createStore()) {
  return {
    ...render(<Provider store={store}>{ui}</Provider>),
    store,
  };
}

describe('ColorAddModal', () => {
  const onConfirm = vi.fn();

  beforeEach(() => {
    onConfirm.mockClear();
  });

  afterEach(() => cleanup());

  it('색상 스와치 6개를 렌더링한다', () => {
    renderWithStore(<ColorPaletteModal colorInfos={[]} onConfirm={onConfirm} />);
    expect(screen.getAllByRole('button')).toHaveLength(6);
  });

  it('중복되지 않는 색상 클릭 시 onConfirm을 호출한다', () => {
    renderWithStore(<ColorPaletteModal colorInfos={[]} onConfirm={onConfirm} />);
    fireEvent.click(screen.getByLabelText(PRESET_COLORS[0]));
    expect(onConfirm).toHaveBeenCalledWith(PRESET_COLORS[0]);
  });

  it('중복 색상 클릭 시 onConfirm을 호출하지 않는다', () => {
    renderWithStore(
      <ColorPaletteModal
        colorInfos={[{ hex: PRESET_COLORS[0], quantity: 1, meaningId: '', tags: [] }]}
        onConfirm={onConfirm}
      />,
    );
    // debug: check prop is received
    expect(screen.getByLabelText(PRESET_COLORS[0])).toBeTruthy();
    fireEvent.click(screen.getByLabelText(PRESET_COLORS[0]));
    expect(onConfirm).not.toHaveBeenCalled();
  });

  it('중복 색상 클릭 시 토스트 "이미 추가된 색상입니다"를 표시한다', () => {
    const store = createStore();
    renderWithStore(
      <ColorPaletteModal
        colorInfos={[{ hex: PRESET_COLORS[0], quantity: 1, meaningId: '', tags: [] }]}
        onConfirm={onConfirm}
      />,
      store,
    );
    fireEvent.click(screen.getByLabelText(PRESET_COLORS[0]));
    const toasts = store.get(toastListAtom);
    expect(toasts.some((t) => t.message === '이미 추가된 색상입니다')).toBe(true);
  });
});
