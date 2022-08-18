// Copyright 2020-2021 OnFinality Limited authors & contributors
// SPDX-License-Identifier: Apache-2.0

const en = {
  translation: {
    header: {
      home: 'Home',
      claim: 'Claim',
      sale: 'Public Sale',
      network: 'Subquery Network',
      airdrop: 'Airdrop',
      studio: 'Studio',
      documentation: 'Documentation',
      github: 'Github',
      connectWallet: 'Connect',
      hosted: 'Hosted Service'
    },
    footer: {
      title: 'Join The Future',
      copyright: 'SubQuery © '
    },
    projectCard: {
      noDescription: 'No description'
    },
    airdrop: {
      check: 'Thank you for contributing to SubQuery’s growth',
      eligible: 'You may be eligible for airdrop.',
      connectWallet: 'Connect your wallet to find out',
      connectBrowserWallet: 'Connect using browser wallet',
      agreeWith: 'Agree with the',
      signature: 'by signing a signature.',
      signOnMetamask: 'Sign on Metamask',
      yourAirDrop: 'Your airdrop',
      category: 'category',
      amount: 'amount',
      status: 'status',
      addition: 'Addition',
      unlockedTitle: 'Unlocked (Claimable)',
      unlocked: 'Unlocked',
      locked: 'Locked',
      initContract: 'Checking your airdrop from contracts...',
      claimed: 'You’ve Claimed',
      expired: 'Expired',
      total: 'Your Total Allocation',
      whenUnlock: 'Unlocked {{date}}',
      youHvClaimed: `You've already claimed this`,
      whenExpired: 'Expired {{date}}',
      whenExpires: 'Expires {{date}}',
      nextMilestone: 'Next Milestone',
      claimTitle: ' Your Airdrop ({{token}})',
      description:
        'Only Ambassadors and the best Indexers from the SubQuery Frontier Testnet will be eligible to receive kSQT airdrops.',
      claim: 'Claim Your Unlocked Tokens',
      successClaim: 'You have claimed airdrop successfully',
      nonToClaim: 'No Claimable Airdrop Available'
    },
    wallet: {
      connectionErr: 'Unfortunately we did not recceive the confirmation, Please try again.',
      connectAndSigned: 'You’ve agreed with the Terms and Conditions.',
      useBrowserMetamask: 'Please use desktop browser to connect wallet.'
    },
    subscription: {
      getNotified: 'Get notified when the claim date is announced',
      enterEmail: 'Enter email',
      subscribe: 'Subscribe',
      privacy: 'privacy policy',
      termsAndConditionsPart1: "By clicking subscribe you have read and agreed to SubQuery's ",
      termsAndConditionsPart2: ' and consent for SubQuery to send you updates and other information via email'
    },
    termsAndConditions: {
      title: 'Terms & Conditions',
      sign: 'Agree Terms & Conditions before claim'
    },
    faq: {
      title: 'FAQs',
      whoCanMintQ: 'Who can calim and how much?',
      whoCanMintA: 'RandomText......',
      walletConnectOptionQ: 'Can I connect my wallet through other methods?',
      walletConnectOptionA: 'RandomText......'
    },
    support: {
      joinDiscord: 'Join Our Discord for Announcements on Claim Dates',
      turnOnNotification:
        'Make sure you turn on notifications for the <1>#announcement</1> channel so you don’t miss any updates',
      contact: 'If you have any questions, contact us on the <1>#kepler-support-channel</1> channel on Discord',
    },
    error: {
      404: '404',
      pageNotFound: 'Oops! Page not found'
    },
    notification: {
      success: 'Success!',
      error: 'Sorry, there is something wrong',
      txSubmittedTitle: 'Transaction has been submitted. Please wait for the transaction confirmed.',
      changeValidIn15s: 'Change will be reflected on dashboard in 15s.'
    },
    unsupportedNetwork: {
      title: 'Unsupported network',
      subtitle: 'Please switch networks to claim the airdrop.',
      button: 'Switch Network'
    }
  }
};

export type Translations = typeof en;

export default en;
