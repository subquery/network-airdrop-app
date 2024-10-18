import * as React from 'react';
import { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { MdKeyboardArrowDown, MdKeyboardArrowUp } from 'react-icons/md';
import { Typography } from '@subql/components';
import { ActiveEnum } from 'conf/enums';

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

export const FAQ: React.FC<{
  type?: ActiveEnum;
}> = ({ type }) => {
  const { t } = useTranslation();

  const faqs = React.useMemo(() => {
    if (type === ActiveEnum.Challenge) {
      return [
        {
          question: 'What is the SubQuery Seekers 50 Million SQT Challenge?',
          answer: (
            <>
              <span>
                Throughout years of building SubQuery, our thriving community has been at the forefront of everything we
                do. You&apos;ve been supporting us, sharing our vision with your friends, and helping us reach thousands
                of web3 natives. With your support, we&apos;re not just a company - we&apos;re a movement driving an
                inclusive and decentralised web3 era.
              </span>
              <span>
                We&apos;ve been running Zealy campaigns for some time, but as we get closer to the public sale and TGE,
                we&apos;re launching the SubQuery Seekers Challenge to reward our most valued community members and to
                help decentralise our token and network.
              </span>
              <span>
                We are giving away 50 Million SQT to our most valued community members in the SubQuery Seekers Program.
                Simply register for the campaign, and start exploring the challenges. The more challenges you complete,
                the more SQT tokens you can earn!
              </span>
              <span>
                There will be a lot of announcements, reveals, and exciting alpha for members of our community
                throughout this program, so sign up and complete onboarding asap and start receiving points towards the
                SubQuery Seekers Challenge.
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
                In order to join, you just need to be 18 years or over, and in order to claim any SQT Airdrops you
                receive, you&apos;ll just need to be able to complete KYC to verify your identity.
              </span>
              <span>
                Additionally, due to compliance and regulations jurisdictions such as the USA, New Zealand, Philippines,
                Iran, North Korea, Syria, Cuba will not be able to participate.
              </span>
            </>
          )
        },
        {
          question: 'What is the timeline?',
          answer: (
            <>
              <span>
                Please carefully read the dates below which detail the timeline for the closing of the Seekers Program
                and when you can expect rewards to be distributed.
              </span>
              <ul>
                <li>- Program End Date: Wednesday 10 April 2024 11:59pm UTC</li>
                <li>- KYC Deadline: Wednesday 10 April 2024 11:59pm UTC</li>
                <li>
                  - Processing Window (for any KYC checks still in progress and final issue resolution): Wednesday 10
                  April 2024 - Friday 12 April 2024
                </li>
                <li>- Rewards Distribution Date: Tuesday 16 April 2024</li>
                <li>- Rewards Vesting: 6 months linear</li>
              </ul>
            </>
          )
        },
        {
          question: 'Who is an eligible participant?',
          answer: (
            <>
              <span>
                As we&apos;ve always mentioned, the 50 million SQT rewards will be distributed at the end of the program
                to all valid participants who earn over a certain threshold.
              </span>
              <span>
                To be an eligible participant, you must have an approved KYC check, a verified email, and have recieved
                at least 1,000 points on the Seekers program.
              </span>
              <span>
                Only eligible participant will receive points in Seekers, or count towards referral bonuses of other
                participants.
              </span>
            </>
          )
        },
        {
          question: 'Do I need to complete KYC?',
          answer: (
            <>
              <span>
                Yes, legally we are required to. KYC is simply a standard identity verification process, required for
                legal and compliance purposes while dealing with financial assets (like $SQT tokens). This also filters
                out bad actors, prevents Sybil attacks, and helps keep the seekers safe and secure.
              </span>
              <span>
                You don&apos;t need to complete KYC to join the program, but you will need to complete KYC by the 10th
                of April in be awarded any SQT.
              </span>
            </>
          )
        },
        {
          question: 'How will points be converted to SQT?',
          answer: (
            <>
              <span>
                Through completing challenges, participants will earn points and battle it out for the top spots on the
                leaderboard.
              </span>
              <span>
                Once the program concludes on the 10th of April, we then process all points and KYC submissions. By the
                16th of April, we will distribute all of the 50 Million SQT tokens to all eligible participants in the
                program. The distribution will be proportional to the points accumulated by each participant. So, keep
                an eye on the leaderboard and strive to climb your way to the top for a chance to earn more SQT!
              </span>
            </>
          )
        },
        {
          question: 'How do I claim SQT?',
          answer: (
            <>
              <span>
                The 50 million SQT rewards pool will be divided and distributed proportionately on Tuesday 16th of April
                2024.
              </span>
              <span>
                The SQT rewards will be on the Base network and you will need to claim them on the{' '}
                <a href="https://claim.subquery.foundation" target="_blank" rel="noreferrer">
                  SubQuery Claim page (https://claim.subquery.foundation)
                </a>
                , the same way you may have claimed SQT airdrops or Public Sale tokens.
              </span>
              <span>
                You will have 1 month to claim your rewards, the deadline for claiming will be Tuesday 16th of May 2024.
              </span>
            </>
          )
        },
        {
          question: 'What is SQT?',
          answer: (
            <>
              <span>
                The SubQuery Network is powered by the SubQuery Token (SQT), designed as a utility token that powers the
                SubQuery Network, providing an incentive for participation, as well as serving as a medium of exchange
                for transactions within the SubQuery Network. Consumers of data will commit SQT in exchange for RPC
                queries from RPC Providers or indexed data from Data Indexers and this SQT will be distributed among
                Node Operators based on the payment method selected.
              </span>
              <span>
                At the time of the mainnet launch, we want to reward our loyal community members and ensure the SQT
                token is well distributed globally - the SubQuery Seekers Challenge will help us achieve this.
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
    }

    if (type === ActiveEnum.DelegatorCampaign) {
      return [
        {
          question: 'What is the SubQuery Summer Delegator Frenzy Campaign?',
          answer: (
            <>
              <span>
                The campaign is all about turbocharging your delegation rewards! In addition to your regular rewards,
                this campaign lets you earn points for completing various network tasks. Accumulate points to rise up
                the leaderboard and claim your share of a substantial SQT prize pool. Plus, we&apos;re adding an extra
                layer of excitement with plenty of random loot box giveaways that can propel you even higher in the
                rankings!
              </span>
              <span>
                Delegators already have a current APY of 14%, so there is absolutely no downside in participating in
                this campaign.
              </span>
            </>
          )
        },
        {
          question: 'How much is up for grabs?',
          answer: (
            <>
              <span>
                The campaign is all about turbocharging your delegation rewards! In addition to your regular rewards,
                this campaign lets you earn points for completing various network tasks. Accumulate points to rise up
                the leaderboard and claim your share of a substantial SQT prize pool. Plus, we&apos;re adding an extra
                layer of excitement with plenty of random loot box giveaways that can propel you even higher in the
                rankings!
              </span>
              <span>
                The prize you recieve depends on the rank you get in the program, so a higher rank, the more points you
                get, the more points you recieve!
              </span>
              <span>
                <table className={styles.rankTable}>
                  <tr>
                    <th>Valid Delegator Rank</th>
                    <th>Reward (SQT)</th>
                  </tr>
                  <tr>
                    <td>1st</td>
                    <td className={styles.rankValue}>300,000</td>
                  </tr>
                  <tr>
                    <td>2nd</td>
                    <td className={styles.rankValue}>200,000</td>
                  </tr>
                  <tr>
                    <td>3rd</td>
                    <td className={styles.rankValue}>120,000</td>
                  </tr>
                  <tr>
                    <td>4th</td>
                    <td className={styles.rankValue}>75,000</td>
                  </tr>
                  <tr>
                    <td>5th</td>
                    <td className={styles.rankValue}>55,000</td>
                  </tr>
                  <tr>
                    <td>Top 10</td>
                    <td className={styles.rankValue}>35,000</td>
                  </tr>
                  <tr>
                    <td>Top 20</td>
                    <td className={styles.rankValue}>20,000</td>
                  </tr>
                  <tr>
                    <td>Top 50</td>
                    <td className={styles.rankValue}>12,000</td>
                  </tr>
                  <tr>
                    <td>Top 100</td>
                    <td className={styles.rankValue}>8,000</td>
                  </tr>
                  <tr>
                    <td>Top 200</td>
                    <td className={styles.rankValue}>3,000</td>
                  </tr>
                  <tr>
                    <td>Everyone else</td>
                    <td className={styles.rankValue}>1,000</td>
                  </tr>
                </table>
              </span>
              <span>
                <i>
                  Note: Valid Delegators are Delegators who delegate at least 3,000 SQT for 2 full eras during the
                  program and have verified their email address. We want new frens in the Network!
                </i>
              </span>
            </>
          )
        },
        {
          question: 'How long does the campaign run for?',
          answer: (
            <>
              <span>
                The campaign is set to run from Era 21 to Era 35 - this is 15 weeks in total and will commence this
                Friday 5th July! Meaning anyone who is not yet delegating should secure some SQT asap and start now!
              </span>
              <span>
                The campaign concludes at the end of Summer, on Friday 18th October when the prize pool will then be
                distributed to all eligible participants. Stay tuned for regular updates, announcements, and surprises
                throughout the campaign.
              </span>
            </>
          )
        },
        {
          question: 'Who can participate?',
          answer: (
            <>
              <span>
                Anyone can participate! Simply get yourself some SQT through one of the methods below if you don&apos;t
                already have any and then register for the Frenzy campaign and start completing delegation challenges
                here.
              </span>
              <span>
                <strong>
                  In order to get rewards at the end, you must be a Valid Delegator. Valid Delegators are Delegators who
                  delegate at least 3,000 SQT for 2 full eras during the program, and have verified their email address.
                </strong>
              </span>
              <span>
                You can acquire SQT to use in the delegation campaign through any of our official exchange pools, the
                more you delegate, the more points you can earn and the higher you can climb the leaderboard.{' '}
                <a href="https://academy.subquery.network/subquery_network/token/token.html#where-is-sqt-traded">
                  Find out where you can get SQT.
                </a>
              </span>
            </>
          )
        },
        {
          question: 'What is delegating?',
          answer: (
            <>
              <span>
                SubQuery&apos;s native token, SQT, serves as the fuel powering our ecosystem. The token was designed as
                a utility token that provides an incentive for participation, as well as serving as a medium of exchange
                for transactions within the SubQuery Network. Through staking (termed ‘delegating’ in the SubQuery
                Network), users receive staking rewards in the form of additional SQT tokens. This means that by
                participating in this campaign, users will receive rewards simply via the reward mechanisms in the
                network AND can become eligible for the Summer Delegation Frenzy prize pool.
              </span>
              <span>
                <a href="https://academy.subquery.network/subquery_network/delegators/introduction.html">
                  Learn how to delegate here.
                </a>
              </span>
            </>
          )
        },
        {
          question: 'How are points converted to SQT?',
          answer: (
            <>
              <span>
                Wondering how your efforts will translate into SQT rewards? Through completing challenges, participants
                will earn points and battle it out for the top spots on the leaderboard. Once the program concludes on
                the 18th of October, we will distribute all of the SQT token pool to all Valid Delegators. The
                distribution will be proportional to the points accumulated by each participant. So, keep an eye on the
                leaderboard and strive to climb your way to the top for a chance to earn more SQT!
              </span>
              <span>
                The prize you recieve depends on the rank you get in the program, so a higher rank, the more points you
                get, the more points you recieve!
              </span>
              <span>
                <table className={styles.rankTable}>
                  <tr>
                    <th>Valid Delegator Rank</th>
                    <th>Reward (SQT)</th>
                  </tr>
                  <tr>
                    <td>1st</td>
                    <td className={styles.rankValue}>300,000</td>
                  </tr>
                  <tr>
                    <td>2nd</td>
                    <td className={styles.rankValue}>200,000</td>
                  </tr>
                  <tr>
                    <td>3rd</td>
                    <td className={styles.rankValue}>120,000</td>
                  </tr>
                  <tr>
                    <td>4th</td>
                    <td className={styles.rankValue}>75,000</td>
                  </tr>
                  <tr>
                    <td>5th</td>
                    <td className={styles.rankValue}>55,000</td>
                  </tr>
                  <tr>
                    <td>Top 10</td>
                    <td className={styles.rankValue}>35,000</td>
                  </tr>
                  <tr>
                    <td>Top 20</td>
                    <td className={styles.rankValue}>20,000</td>
                  </tr>
                  <tr>
                    <td>Top 50</td>
                    <td className={styles.rankValue}>12,000</td>
                  </tr>
                  <tr>
                    <td>Top 100</td>
                    <td className={styles.rankValue}>8,000</td>
                  </tr>
                  <tr>
                    <td>Top 200</td>
                    <td className={styles.rankValue}>3,000</td>
                  </tr>
                  <tr>
                    <td>Everyone else</td>
                    <td className={styles.rankValue}>1,000</td>
                  </tr>
                </table>
              </span>
              <span>
                <i>
                  Note: Valid Delegators are Delegators who delegate at least 3,000 SQT for 2 full eras during the
                  program and have verified their email address. We want new frens in the Network!
                </i>
              </span>
            </>
          )
        }
      ];
    }
    return [];
  }, [type]);

  if (!faqs.length) return null;

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

        <div style={{ height: '1px', width: '854px', background: 'var(--dark-mode-border)' }}></div>
      </div>
    </div>
  );
};

export default FAQ;
