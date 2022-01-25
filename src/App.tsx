import { Routes, Route } from 'react-router-dom';
import './App.css';
import { Airdrop, ErrorPgae } from './pages';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Airdrop />} />
        <Route path="/error" element={<ErrorPgae />} />
      </Routes>
    </div>
  );
}

export default App;
