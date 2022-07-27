// Copyright 2020-2022 SubQuery Pte Ltd authors & contributors
// SPDX-License-Identifier: Apache-2.0

// eslint-disable-next-line import/no-extraneous-dependencies
require('dotenv').config();

module.exports = {
  client: {
    service: {
      name: 'airdrop',
      url: process.env.REACT_APP_AIRDROP_SUBQL
    },
    tagName: 'gql',
    excludes: []
  }
};
