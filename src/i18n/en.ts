const en = {
  translation: {
    header: {
      home: 'Home',
      claim: 'Claim',
      sale: 'Public Sale',
      network: 'SubQuery Network',
      airdrop: 'Airdrop',
      studio: 'Studio',
      documentation: 'Documentation',
      github: 'Github',
      connectWallet: 'Connect',
      hosted: 'Hosted Service'
    },
    footer: {
      discord: 'Join our Active Discord community',
      privacy: 'Privacy Policy',
      termsAndConditions: 'Airdrop Terms & Conditions',
      copyright: 'SubQuery Foundation © 2022'
    },
    projectCard: {
      noDescription: 'No description'
    },
    airdrop: {
      notYetOpen: 'Check back soon for when the Airdrop app launches',
      notYetOpenReadMore: 'Read more about the upcoming airdrop',
      title: 'Thank you for contributing to SubQuery’s growth',
      eligible: 'You may be eligible for airdrop, connect your wallet to find out.',
      connectBrowserWallet: 'Connect using browser wallet',
      metamask: 'METAMASK',
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
      initContract: 'Loading… This Will Take Few Seconds',
      claimed: 'Claimed',
      redeemed: 'Redeemed',
      expired: 'Expired',
      total: 'Your Total Allocation',
      whenUnlock: 'Avaliable {{date}}',
      youHvClaimed: `You've already claimed this`,
      whenExpired: 'Expired {{date}}',
      whenExpires: 'Expires {{date}}',
      nextMilestone: 'Next Milestone',
      claimTitle: 'Claim {{token}} and other NFT',
      description: 'If you are eligible to claim any SQT or NFTs, you can see and claim them below.',
      claim: 'Claim Unlocked',
      successClaim: 'You have claimed tokens successfully',
      nonToClaim: 'No Claimable Tokens Available'
    },
    vesting: {
      success: 'You have claimed successfully '
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
      sign: 'Agree To The Terms & Conditions Before Claiming'
    },
    faq: {
      title: 'FAQs',
      whoCanClaimQ: 'Who can claim airdropped tokens and how much?',
      whoCanClaimA:
        'The SubQuery Airdrop is claimable by SubQuery Ambassadors and the highest scoring Indexers from the SubQuery Frontier test network. Please note that it is possible for an individual to be eligible for multiple categories, thereby collecting multiple rewards.',
      howCanClaimQ: 'How do I claim my tokens?',
      howCanClaimA: `The process for claiming your airdrop is: <br/>
        <br/>1. Visit the https://claim.subquery.foundation Website. Please double-check the URL to prevent any risk of scams or fraudulent activity. 
        <br/>2. Connect to your wallet on Metamask 
        <br/>3. Check token rewards based on contribution
        <br/>4. A “Claim” tab will be visible if there’re any unlocked tokens ready to be claimed for your account. 
        <br/>5. You’ll then be asked to sign the Terms and Conditions of our airdrop on the MetaMask. By clicking on the “Sign” button on the MetaMask, you complete the process to agree with the T&C. You only need to sign it once. 
        <br/>6. You will then be prompted with another MetaMask screen to confirm claiming the tokens. By clicking on the “Confirm” button on MetaMask, the transaction will start to be processed.
        <br/>7. Once the transaction is confirmed, you will see a success message popped up on the claim page. You can always check the progress on the Karura block explorer.`,
      howLongAirdropQ: 'How long is the airdrop available for?',
      howLongAirdropA:
        'Eligible users will be able to claim their SQT airdrop tokens for a three month period from the date of our Kepler network launch. You will lose access to any airdrop tokens if you do not claim them by the end of the period.',
      whenCanClaimQ: 'How do I know when I can claim my tokens?',
      whenCanClaimA:
        'We will also post messages on our Twitter, Telegram and Discord at the appropriate time to notify the community.',
      troubleshootingQ: 'Wallet Troubleshooting',
      troubleshootingA:
        'Currently we only support Metamask. If you have any questions, please contact us <1>via Discord</1>.',
      whenWillRecieveQ: 'When will I receive my SQT tokens from the Airdrop?',
      whenWillRecieveA:
        'SQT tokens will be available when the Kepler Network launches. The exact date will be announced closer to the time.',
      whoCanContactQ: 'Who can I contact for help?',
      whoCanContactA:
        'If your question is not answered here, please contact us <1>via our Discord</1> in the Airdrop channel'
    },
    support: {
      joinDiscord: 'Join Our Discord for Announcements on Claim Dates',
      turnOnNotification:
        'Make sure you turn on notifications for the <1>#announcement</1> channel so you don’t miss any updates',
      contact: 'If you have any questions, contact us on the <1>#kepler-support</1> channel on Discord'
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
      title: 'You are connected to the wrong network',
      subtitle: 'Please switch your network to {{network}} to view and claim your airdrop.',
      button: 'Switch Network to {{network}}'
    }
  }
};

export type Translations = typeof en;

export default en;
