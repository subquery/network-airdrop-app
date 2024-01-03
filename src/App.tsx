// eslint-disable-next-line simple-import-sort/imports
import React, { useContext, useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';
import useSWR from 'swr';

// @ts-ignore
import '@subql/components/dist/subquery-components.css';

import { TERMS_URL } from 'appConstants';
import { Header } from 'components';
import { Footer } from 'components/Footer/Footer';
import { AppContext } from 'contextProvider';
import { Home, NotFoundPage } from 'pages';
import { TermsAndConditions } from 'pages/termsAndConditions';
import { fetcher } from 'utils';
import { SubqlProvider } from '@subql/components';

import styles from './App.module.css';

import 'i18n';

function App() {
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
      <SubqlProvider theme="dark">
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
      </SubqlProvider>
    </div>
  );
}

export default App;
