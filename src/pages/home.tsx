import { Link } from 'react-router-dom';
import { Airdrop } from '../components';
import { FAQ } from '../components/FAQ';

export function Home() {
  return (
    <div>
      {/* <div>airdrop</div>
      <Link to="/error">Error</Link> */}
      <Airdrop />
      <FAQ />
    </div>
  );
}
