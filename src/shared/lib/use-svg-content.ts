'use client';

import { useEffect, useState } from 'react';

const svgCache = new Map<string, string>();

function colorSvg(raw: string, color: string): string {
  return raw
    .replace(/fill="black"/g, `fill="${color}"`)
    .replace(/stroke="black"/g, `stroke="${color}"`);
}

export function useSvgContent(svgUrl: string, color: string) {
  const [svg, setSvg] = useState<string | null>(() => {
    const cached = svgCache.get(svgUrl);
    return cached ? colorSvg(cached, color) : null;
  });

  useEffect(() => {
    let cancelled = false;

    const cached = svgCache.get(svgUrl);
    if (cached) {
      setSvg(colorSvg(cached, color));
      return;
    }

    fetch(svgUrl)
      .then((res) => res.text())
      .then((raw) => {
        svgCache.set(svgUrl, raw);
        if (!cancelled) {
          setSvg(colorSvg(raw, color));
        }
      });

    return () => {
      cancelled = true;
    };
  }, [svgUrl, color]);

  return svg;
}
