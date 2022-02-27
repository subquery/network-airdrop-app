const local = {
  REACT_APP_DOMAIN: 'https://airdrop-backend-dev.onfinality.me'
};

const dev = {
  REACT_APP_DOMAIN: 'https://airdrop-backend-dev.onfinality.me'
};

const prod = {
  REACT_APP_DOMAIN: 'http://localhost:3000'
};

const config =
  process.env.REACT_APP_STAGE === 'production' ? prod : process.env.REACT_APP_STAGE === 'staging' ? dev : local;

export default {
  ...config
};
