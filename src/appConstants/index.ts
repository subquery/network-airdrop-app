export * from './urls';
export * from './colors';

export const DATE_FORMAT = 'DD-MMM-YYYY, h:mm a';

export const TOKEN = 'kSQT';

export const DISCORD_INVITE_URL = 'https://discord.gg/zAWxMbrS34';

const Network = process.env.REACT_APP_NETWORK === 'kepler' ? 'Kepler' : undefined;
export const AIRDROP_CATEGORIES: { [key: string]: string } = {
  '0': `${Network ? `${Network} ` : ''}Airdrop - Phase 1 (Indexers)`
};
