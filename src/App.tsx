import { Routes, Route } from 'react-router-dom';
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
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/error" element={<ErrorPgae />} />
        </Routes>
        <Footer />
      </div>
    </Web3Provider>
  );
}

export default App;
