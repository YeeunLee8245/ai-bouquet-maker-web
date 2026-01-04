'use client';

import { useEffect, useRef } from 'react';
import SwaggerUIBundle from 'swagger-ui-dist/swagger-ui-bundle';
import 'swagger-ui-dist/swagger-ui.css';
import './swagger.css';

export default function ApiDocsPage() {
  const elRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // body와 main의 너비 제한 제거
    const body = document.body;
    const main = document.querySelector('main');

    body.classList.add('swagger-full-width');
    if (main) {
      main.classList.add('swagger-full-width');
    }

    if (!elRef.current) {return;}

    SwaggerUIBundle({
      url: '/api/swagger',
      domNode: elRef.current,
      deepLinking: true,
      presets: [SwaggerUIBundle.presets.apis],
      layout: 'BaseLayout',
    });

    // cleanup
    return () => {
      body.classList.remove('swagger-full-width');
      if (main) {
        main.classList.remove('swagger-full-width');
      }
    };
  }, []);

  return (
    <div className="swagger-page">
      <div ref={elRef} />
    </div>
  );
}
