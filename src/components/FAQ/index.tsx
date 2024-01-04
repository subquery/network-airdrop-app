// Copyright 2020-2021 OnFinality Limited authors & contributors
// SPDX-License-Identifier: Apache-2.0

import * as React from 'react';
import { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { MdKeyboardArrowDown, MdKeyboardArrowUp } from 'react-icons/md';
import { Typography } from '@subql/components';

import styles from './FAQ.module.css';

interface IFAQItem {
  question: string;
  answer: string | ReactNode;
  idx: number;
}

const FAQItem = ({ question, answer, idx }: IFAQItem) => {
  const [showAnswer, setShowAnswer] = React.useState<boolean>(false);
  return (
    <>
      <button className={styles.question} type="button" onClick={() => setShowAnswer(!showAnswer)}>
        <Typography variant="large">{question}</Typography>
        <div className={styles.questionBtn}>
          {showAnswer ? (
            <MdKeyboardArrowUp className={styles.questionArrow} />
          ) : (
            <MdKeyboardArrowDown className={styles.questionArrow} />
          )}
        </div>
      </button>
      {showAnswer && (
        <Typography type="secondary" style={{ textAlign: 'left', display: 'flex', flexDirection: 'column', gap: 24 }}>
          {answer}
        </Typography>
      )}
    </>
  );
};

export const FAQ: React.VFC = () => {
  const { t } = useTranslation();

  const faqs = [
    {
      question: 'Who is the SubQuery 50 Million SQT Community Airdrop',
      answer: (
        <>
          <span>
            We’ve been busy building SubQuery over the past few years but we owe everything to you, our community! As we
            get closer to the launch of our mainnet, we’re launching the 50 Million SQT Community Airdrop to reward our
            most valued community members and to help decentralise our token and network.
          </span>
          <span>
            There will be a lot of announcements, reveals, and exciting alpha for members of our community throughout
            this program, so sign up and complete onboarding asap and start receiving points towards this Airdrop.
          </span>
        </>
      )
    },
    {
      question: 'Who can join the 50 Million SQT Community Airdrop Challenge',
      answer: (
        <>
          <span>
            SubQuery’s 50 Million SQT Community Airdrop Challenge is a safe space and open to all that want to join the
            SubQuery Community.
          </span>

          <span>
            In order to join, you just need to be 18 years or over, and in order to claim any SQT Airdrops you receive,
            you’ll just need to be able to complete KYC to verify your identity.
          </span>
        </>
      )
    },
    {
      question: 'Do I need to complete KYC',
      answer: (
        <>
          <span>
            Yes, legally we are required to. KYC is simply a standard identity verification process, required for legal
            and compliance purposes while dealing with financial assets (like $SQT tokens rewards). This also filters
            out bad actors, prevents Sybil attacks, and helps keep the tribe safe and secure.
          </span>

          <span>
            You don’t need to complete KYC to join the program, but you will need to complete KYC at the end to claim
            any of your rewards as SQT airdrops.
          </span>
        </>
      )
    },
    {
      question: 'How will points be converted to SQT',
      answer:
        'Once the program closes on the 15th of February, we will be distributing the 50 Million SQT to all valid participants proportionally based on the points they receive. Make sure to work your way up the leaderboard as fast as possible!'
    }
  ];

  return (
    <div className={styles.faqContainer}>
      <div className={styles.faq}>
        <Typography variant="h4" weight={600} style={{ marginBottom: 24 }}>
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
