// Copyright 2020-2022 SubQuery Pte Ltd authors & contributors
// SPDX-License-Identifier: Apache-2.0

import * as Sentry from '@sentry/react';
import { isString } from 'lodash-es';

const eventLimiter: { [index: string]: boolean } = {};

const filterMsg = [
  'Request failed with status code 401',
  'WebSocket connection failed for host: wss://relay.walletconnect.org',
  'Cannot redefine property: ethereum',
  'Request failed with status code 400',
  'Socket stalled when trying to connect to wss://relay.walletconnect.org',
  'Network Error',
  'Maximum call stack size exceeded'
];

Sentry.init({
  beforeSend: (event, hint) => {
    const rawError = hint?.originalException as Error;
    if (!rawError) return event;
    const msg = isString(rawError) ? rawError : rawError.message;

    // do not send event if already sent in last 1 minute
    if (msg && msg in eventLimiter) {
      return null;
    }

    if (filterMsg.some((i) => msg.includes(i))) {
      return null;
    }

    eventLimiter[msg] = true;

    setTimeout(() => {
      delete eventLimiter[msg];
    }, 60 * 1000);

    return event;
  },
  // this env set on Github workflow.
  dsn:
    process.env.REACT_APP_NETWORK === 'testnet'
      ? ''
      : 'https://c8688e8c4ce142aebdad3bb0a5cc789c@o1192865.ingest.sentry.io/6321055',
  integrations: [new Sentry.BrowserTracing()],
  environment: process.env.REACT_APP_NETWORK,
  // Set tracesSampleRate to 1.0 to capture 100%
  tracesSampleRate: 1.0,
  attachStacktrace: true
});
