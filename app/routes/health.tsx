import { json } from '@remix-run/node';
import type { LoaderFunction } from '@remix-run/node';

export const loader: LoaderFunction = async () => {
  return json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'omniai',
    version: '1.0.0',
  });
}; 