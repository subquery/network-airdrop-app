import React, { useContext, useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';
import useSWR from 'swr';

import { TERMS_URL } from 'appConstants';
import { Footer, Header } from 'components';
import { useWeb3 } from 'containers';
import { AppContext } from 'contextProvider';
import { Home, NotFoundPage } from 'pages';
import { TermsAndConditions } from 'pages/termsAndConditions';
import { fetcher } from 'utils';

import styles from './App.module.css';

import 'i18n';

function App() {
  const { error: web3Error } = useWeb3();
  console.log('web3Error', web3Error);
  const { setTermsAndConditions, setTermsAndConditionsVersion } = useContext(AppContext);

  const { data, error } = useSWR(TERMS_URL, fetcher);

  useEffect(() => {
    if (data && setTermsAndConditions && setTermsAndConditionsVersion) {
      setTermsAndConditions(data.termsAndConditions);
      setTermsAndConditionsVersion(data.version);
    }
  }, [data, error]);

  return (
    <div className={styles.app}>
      <Header />
      <div className={styles.appBody}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
          <Route path="/404" element={<NotFoundPage />} />
          <Route path="*" element={<Home />} />
        </Routes>
      </div>
      <Footer />
    </div>
  );
}

export default App;
