import type { VercelRequest, VercelResponse } from '@vercel/node';

let app: any;
let loadError: any;

try {
  app = (await import('../server')).default;
} catch (e) {
  loadError = e;
  console.error('[api/index] Failed to load server module:', e);
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (loadError || !app) {
    return res.status(500).json({
      error: 'Server failed to initialize',
      debug: loadError?.message || String(loadError),
      stack: loadError?.stack?.split('\n').slice(0, 5)
    });
  }
  return app(req, res);
}
