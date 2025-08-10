// Load environment variables before anything else
import 'dotenv/config';

import { createRequestHandler } from '@remix-run/node';
import { broadcastDevReady } from '@remix-run/node';
import * as build from './build/index.js';

// Validate environment variables
import './verify-env.js';

const handler = createRequestHandler(build, process.env.NODE_ENV);

if (process.env.NODE_ENV === 'development') {
  broadcastDevReady(build);
}

export default handler; 