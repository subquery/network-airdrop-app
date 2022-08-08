// Copyright 2020-2021 OnFinality Limited authors & contributors
// SPDX-License-Identifier: Apache-2.0

import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { MdKeyboardArrowDown,MdKeyboardArrowUp } from 'react-icons/md';
import { Typography } from '@subql/react-ui';

import styles from './FAQ.module.css';

interface IFAQItem {
  question: string;
  answer: string;
  idx: number;
}

const FAQItem = ({ question, answer, idx }: IFAQItem) => {
  const initialShowStatus = idx === 0;
  const [showAnswer, setShowAnswer] = React.useState<boolean>(initialShowStatus);
  return (
    <>
      <button className={styles.question} type="button" onClick={() => setShowAnswer(!showAnswer)}>
        <Typography className={styles.questionTxt}>{question}</Typography>
        <div className={styles.questionBtn}>
          {showAnswer ? (
            <MdKeyboardArrowUp className={styles.questionArrow} />
          ) : (
            <MdKeyboardArrowDown className={styles.questionArrow} />
          )}
        </div>
      </button>
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

        {faqs.map((faq, idx) => (
          <div key={faq.question} className={styles.faqItem}>
            <FAQItem question={faq.question} answer={faq.answer} idx={idx} />
          </div>
        ))}
      </div>
    </div>
  );
};
