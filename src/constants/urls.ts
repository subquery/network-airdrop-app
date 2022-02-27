import env from '../env.config';

export const DOMAIN = env.REACT_APP_DOMAIN;

export const TERMS_URL = `${DOMAIN}/terms`;

export const TERMS_SIGNATURE_URL = `${DOMAIN}/terms-and-conditions-signature`;

export const ACCOUNT_INFO_URL = `${DOMAIN}/account`;

export const EMAIL_SUSCRIBE_URL = `${DOMAIN}/subscribe`;
