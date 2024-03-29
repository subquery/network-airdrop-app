// Copyright 2020-2022 SubQuery Pte Ltd authors & contributors
// SPDX-License-Identifier: Apache-2.0

import * as React from 'react';

import { COLORS } from 'appConstants';

import { AppTypography } from '../AppTypography';

/**
 * Custom style of table cell content using antD.
 * Apply for tables of staking dashboard / plan manager..
 */

interface TableTitleProps {
  title?: string;
  className?: string;
  tooltip?: string;
  children?: string | React.ReactNode;
}

export const TableTitle: React.FC<TableTitleProps> = ({ title, children: childrenArg, tooltip, ...props }) => {
  const children = childrenArg && typeof childrenArg === 'string' ? childrenArg.toUpperCase() : childrenArg;
  const content = title ? title.toUpperCase() : title;
  return (
    <AppTypography
      {...props}
      content={content}
      tooltip={tooltip}
      noTooltipIcon={!tooltip}
      tooltipColor={COLORS.gray700}
    >
      {children}
    </AppTypography>
  );
};
