import { useContext, useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';
import useSWR from 'swr';

import { TERMS_URL } from 'appConstants';
import { Footer, Header } from 'components';
import { AppContext } from 'contextProvider';
import { Home, NotFoundPage } from 'pages';
import { TermsAndConditions } from 'pages/termsAndConditions';
import { fetcher } from 'utils';

import './App.css';
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
    <div className="App">
      <Header />
      <div className="AppBody">
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
