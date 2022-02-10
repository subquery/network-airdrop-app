import { Link } from 'react-router-dom';
import { Airdrop } from '../components';
import { FAQ } from '../components/FAQ';

export function Home() {
  return (
    <div>
      <Airdrop />
      <FAQ />
    </div>
  );
}
