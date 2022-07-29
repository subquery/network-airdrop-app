import { Airdrop } from '../components';
import { EmailSubscription } from '../components/EmailSubscription';
import { FAQ } from '../components/FAQ';
import { WalletDetect } from '../components/WalletDetect/WalletDetect';
import { useWeb3 } from '../containers';
import styles from './home.module.css';

export function Home() {
  return (
    <div>
      <div className={styles.container}>
        <img src="static/airdrop.png" alt="airdrop page img" className={styles.bgImg} />
        <WalletDetect>
          <div className={styles.airdropContainer}>
            <div className={styles.airdropContent}>
              <Airdrop />
              <EmailSubscription />
            </div>
          </div>
        </WalletDetect>
      </div>

      <FAQ />
    </div>
  );
}
