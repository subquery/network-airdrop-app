// Copyright 2020-2021 OnFinality Limited authors & contributors
// SPDX-License-Identifier: Apache-2.0

import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { Typography } from '@subql/react-ui';
import { MdKeyboardArrowUp, MdKeyboardArrowDown } from 'react-icons/md';
import styles from './FAQ.module.css';

interface IFAQItem {
  question: string;
  answer: string;
}

const FAQItem = ({ question, answer }: IFAQItem) => {
  const [showAnswer, setShowAnswer] = React.useState<boolean>();
  return (
    <>
      <div className={styles.question}>
        <Typography className={styles.questionTxt}>{question}</Typography>
        <button className={styles.questionBtn} type="button">
          {showAnswer ? (
            <MdKeyboardArrowUp
              className={styles.questionArrow}
              onClick={() => setShowAnswer(false)}
            />
          ) : (
            <MdKeyboardArrowDown
              className={styles.questionArrow}
              onClick={() => setShowAnswer(true)}
            />
          )}
        </button>
      </div>
      {showAnswer && <Typography className={styles.answer}>{answer}</Typography>}
    </>
  );
};

export const FAQ: React.VFC = () => {
  const { t } = useTranslation();

  const faqs = [
    {
      question: t('faq.whoCanMintQ'),
      answer: t('faq.whoCanMintA')
    },
    {
      question: t('faq.walletConnectOptionQ'),
      answer: t('faq.walletConnectOptionA')
    }
  ];

  return (
    <div className={styles.faqContainer}>
      <div className={styles.faq}>
        <Typography className={styles.faqHeader} variant="h5">
          {t('faq.title')}
        </Typography>

        {faqs.map((faq) => (
          <div key={faq.question} className={styles.faqItem}>
            <FAQItem question={faq.question} answer={faq.answer} />
          </div>
        ))}
      </div>
    </div>
  );
};
