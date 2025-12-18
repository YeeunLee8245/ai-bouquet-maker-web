'use client';

import { useEffect, useRef } from 'react';
import SwaggerUIBundle from 'swagger-ui-dist/swagger-ui-bundle';
import 'swagger-ui-dist/swagger-ui.css';
import './swagger.css';

export default function ApiDocsPage() {
  const elRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!elRef.current) {return;}

    SwaggerUIBundle({
      url: '/api/swagger',
      domNode: elRef.current,
      deepLinking: true,
      presets: [SwaggerUIBundle.presets.apis],
      layout: 'BaseLayout',
    });
  }, []);

  return (
    <div className="swagger-page">
      <div ref={elRef} />
    </div>
  );
}
