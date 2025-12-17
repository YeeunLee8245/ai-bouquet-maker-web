import { NextResponse } from 'next/server';
import { createSwaggerSpec } from 'next-swagger-doc';

export const GET = async () => {
  const spec = createSwaggerSpec({
    definition: {
      openapi: '3.0.0',
      info: { title: 'My API', version: '0.1.0' },
    },
    apiFolder: 'src/app/api',
  });

  return NextResponse.json(spec);
};
