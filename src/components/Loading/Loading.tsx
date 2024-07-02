import styles from './Loading.module.less';

export const Loading = () => (
  <div className={styles.container}>
    <p className={styles.loadingText} aria-label="Loading">
      <span className={styles.divider} aria-hidden="true"></span>
      <span className={styles.letter} aria-hidden="true">
        L
      </span>
      <span className={styles.letter} aria-hidden="true">
        o
      </span>
      <span className={styles.letter} aria-hidden="true">
        a
      </span>
      <span className={styles.letter} aria-hidden="true">
        d
      </span>
      <span className={styles.letter} aria-hidden="true">
        i
      </span>
      <span className={styles.letter} aria-hidden="true">
        n
      </span>
      <span className={styles.letter} aria-hidden="true">
        g
      </span>
    </p>
  </div>
);
