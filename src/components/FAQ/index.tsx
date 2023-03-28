// Copyright 2020-2021 OnFinality Limited authors & contributors
// SPDX-License-Identifier: Apache-2.0

import * as React from 'react';
import { ReactNode } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { MdKeyboardArrowDown, MdKeyboardArrowUp } from 'react-icons/md';
import { Typography } from '@subql/react-ui';

import { DISCORD_INVITE_URL } from 'appConstants';

import styles from './FAQ.module.css';

interface IFAQItem {
  question: string;
  answer: string | ReactNode;
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
      question: t('faq.whoCanClaimQ'),
      answer: t('faq.whoCanClaimA')
    },
    {
      question: t('faq.howCanClaimQ'),
      answer: <Trans i18nKey="faq.howCanClaimA" />
    },
    {
      question: t('faq.howLongAirdropQ'),
      answer: t('faq.howLongAirdropA')
    },
    {
      question: t('faq.whenCanClaimQ'),
      answer: t('faq.whenCanClaimA')
    },
    {
      question: t('faq.troubleshootingQ'),
      answer: (
        <Trans i18nKey="faq.troubleshootingA">
          Currently we only support Metamask. If you have any questions, please contact us
          <a className={styles.discordLink} href={DISCORD_INVITE_URL} target="_blank" rel="noreferrer">
            via Discord
          </a>
        </Trans>
      )
    },
    {
      question: t('faq.whenWillRecieveQ'),
      answer: t('faq.whenWillRecieveA')
    },
    {
      question: t('faq.whoCanContactQ'),
      answer: (
        <Trans i18nKey="faq.whoCanContactA">
          If your question is not answered here, please contact us
          <a className={styles.discordLink} href={DISCORD_INVITE_URL} target="_blank" rel="noreferrer">
            via our Discord
          </a>
          via our Discord in the Airdrop channel
        </Trans>
      )
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
