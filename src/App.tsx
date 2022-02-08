import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import './i18n';
import { Home, ErrorPgae } from './pages';
import { Header, Footer } from './components';
import {
  Web3Provider
  // IPFSProvider,
  // ProjectMetadataProvider,
  // QueryRegistryProvider,
  // ContractsProvider,
  // QueryRegistryProjectProvider,
  // UserProjectsProvider,
  // IndexerRegistryProvider,
} from './containers';

function App() {
  return (
    <Web3Provider>
      <div className="App">
        <Header />
        <div className="AppBody">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/error" element={<ErrorPgae />} />
            <Route path="*" element={<Home />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </Web3Provider>
  );
}

export default App;
