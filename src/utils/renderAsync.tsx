// Copyright 2020-2021 OnFinality Limited authors & contributors
// SPDX-License-Identifier: Apache-2.0

import * as React from 'react';

import { Spinner as DefaultSpinner } from '../components';

type RenderResult = React.ReactElement | null;
export type AsyncData<T> = Readonly<{ data?: T; loading: boolean; error?: Error }>;
type Handlers<T> = {
  loading?: () => RenderResult;
  error: (error: Error) => RenderResult;
  data: (data: T, asyncData: AsyncData<T>) => RenderResult;
};

export function renderAsync<T>(data: AsyncData<T>, handlers: Handlers<T>): RenderResult {
  if (data.data !== undefined) {
    try {
      return handlers.data(data.data, data);
    } catch (e) {
      return handlers.error(e as Error);
    }
  } else if (data.error) {
    return handlers.error(data.error);
  } else if (data.loading) {
    return handlers.loading ? handlers.loading() : <DefaultSpinner />;
  }

  return null;
}
