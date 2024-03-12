import * as React from 'react';
import { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { MdKeyboardArrowDown, MdKeyboardArrowUp } from 'react-icons/md';
import { Typography } from '@subql/components';

import styles from './FAQ.module.less';

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
      question: 'What is the SubQuery Seekers 50 Million SQT Challenge?',
      answer: (
        <>
          <span>
            Throughout years of building SubQuery, our thriving community has been at the forefront of everything we do.
            You’ve been supporting us, sharing our vision with your friends, and helping us reach thousands of web3
            natives. With your support, we’re not just a company - we’re a movement driving an inclusive and
            decentralised web3 era.
          </span>
          <span>
            We’ve been running Zealy campaigns for some time, but as we get closer to the public sale and TGE, we’re
            launching the SubQuery Seekers Challenge to reward our most valued community members and to help
            decentralise our token and network.
          </span>
          <span>
            We are giving away 50 Million SQT to our most valued community members in the SubQuery Seekers Program.
            Simply register for the campaign, and start exploring the challenges. The more challenges you complete, the
            more SQT tokens you can earn!
          </span>
          <span>
            There will be a lot of announcements, reveals, and exciting alpha for members of our community throughout
            this program, so sign up and complete onboarding asap and start receiving points towards the SubQuery
            Seekers Challenge.
          </span>
        </>
      )
    },
    {
      question: 'Who can participate?',
      answer: (
        <>
          <span>
            SubQuery Seekers 50 Million SQT Challenge is a safe space and open to all that want to join the SubQuery
            Community.
          </span>
          <span>
            In order to join, you just need to be 18 years or over, and in order to claim any SQT Airdrops you receive,
            you’ll just need to be able to complete KYC to verify your identity.
          </span>
          <span>
            Additionally, due to compliance and regulations jurisdictions such as the USA, New Zealand, Philippines,
            Iran, North Korea, Syria, Cuba will not be able to participate.
          </span>
        </>
      )
    },
    {
      question: 'Do I need to complete KYC?',
      answer: (
        <>
          <span>
            Yes, legally we are required to. KYC is simply a standard identity verification process, required for legal
            and compliance purposes while dealing with financial assets (like $SQT tokens). This also filters out bad
            actors, prevents Sybil attacks, and helps keep the seekers safe and secure.
          </span>
          <span>
            You don’t need to complete KYC to join the program, but you will need to complete KYC at the end to claim
            any of your SQT rewards.
          </span>
        </>
      )
    },
    {
      question: 'How will points be converted to SQT?',
      answer:
        'Through completing challenges, participants will earn points and battle it out for the top spots on the leaderboard. Once the program concludes on the 10th of April, we will distribute all of the 50 Million SQT tokens to all valid participants that have received a certain threshold on the program. The distribution will be proportional to the points accumulated by each participant. So, keep an eye on the leaderboard and strive to climb your way to the top for a chance to earn more SQT!'
    },
    {
      question: 'What is SQT?',
      answer: (
        <>
          <span>The SubQuery Network is powered by the SubQuery Token (SQT).</span>
          <span>
            The SubQuery Token (SQT) is designed as a utility token that powers the SubQuery Network, providing an
            incentive for participation, as well as serving as a medium of exchange for transactions within the SubQuery
            Network. Consumers of data will commit SQT in exchange for RPC queries from RPC Providers or indexed data
            from Data Indexers and this SQT will be distributed among Node Operators based on the payment method
            selected.
          </span>
          <span>
            At the time of the mainnet launch, we want to reward our loyal community members and ensure the SQT token is
            well distributed globally - the SubQuery Seekers Challenge will help us achieve this.
          </span>
          <span>
            <a
              href="https://academy.subquery.network/subquery_network/token/token.html"
              target="_blank"
              rel="noreferrer"
            >
              Read more about SQT
            </a>
          </span>
        </>
      )
    },
    {
      question: 'How do I get support?',
      answer: (
        <>
          <span>
            You should first check the{' '}
            <a href="https://discord.com/invite/subquery" target="_blank" rel="noreferrer">
              #seekers-support
            </a>{' '}
            channel in our Discord, as others might have the same issue as you.
          </span>
          <span>
            You can submit a support request through our support form at{' '}
            <a href="https://forms.gle/aXPx1aeatKYXAwcZ8" target="_blank" rel="noreferrer">
              https://forms.gle/aXPx1aeatKYXAwcZ8
            </a>
          </span>
        </>
      )
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
