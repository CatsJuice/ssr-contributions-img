import 'reflect-metadata';
import type { IncomingMessage, ServerResponse } from 'http';

import { createApp } from '../src/create-app';

type Handler = (req: IncomingMessage, res: ServerResponse) => void;

let cachedHandlerPromise: Promise<Handler> | undefined;

async function getHandler() {
  if (!cachedHandlerPromise) {
    cachedHandlerPromise = createApp().then(async (app) => {
      await app.init();
      return app.getHttpAdapter().getInstance();
    });
  }

  return cachedHandlerPromise;
}

export default async function handler(
  req: IncomingMessage & { url?: string },
  res: ServerResponse,
) {
  const appHandler = await getHandler();
  const url = new URL(req.url || '/', 'http://localhost');
  const pathname = url.searchParams.get('__pathname') || '/';

  url.searchParams.delete('__pathname');

  req.url = `${pathname}${url.search ? url.search : ''}`;

  return appHandler(req, res);
}
