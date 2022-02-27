import { useContext, useEffect } from 'react';
import useSWR from 'swr';
import { Routes, Route } from 'react-router-dom';
import './App.css';
import './i18n';
import { Home, NotFoundPage } from './pages';
import { Header, Footer } from './components';
import { AppContext } from './contextProvider';
import { fetcher } from './utils';
import { TERMS_URL } from './constants/urls';
import { TermsAndConditions } from './pages/termsAndConditions';

function App() {
  const { setTermsAndConditions, setTermsAndConditionsVersion } = useContext(AppContext);

  const { data, error } = useSWR(TERMS_URL, fetcher);

  useEffect(() => {
    if (data) {
      const { id, content } = data;
      setTermsAndConditions(content);
      setTermsAndConditionsVersion(id);
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
