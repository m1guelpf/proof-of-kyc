# Proof of KYC

> An NFT that proves you've gone through a KYC process, while keeping your personal information as private as possible.

This project uses [Stripe Identity](https://stripe.com/identity) to issue non-transferrable "Proof of KYC" NFTs that could be used as a Sybil-resistance measure. While the system is designed to be as privacy-friendly as possible (redacting the users' information as soon as Stripe lets us), a bad agent could still use the system to dox users[^1].

## How it works

[Stripe](https://stripe.com) recently announced their identity solution, which allows apps to enforce KYC (Know Your Customer) procedures or verify that their users have real identities in a much more effective way than other methods (like phone verification).

This application uses the [Stripe Identity](https://stripe.com/identity) APIs to "link" your wallet with a government-issued form of identification (driver's license, passport or ID card) which is then verified. Upon verification, the app immediately redacts all personal information from Stripe's databases, leaving only a record of wallet addresses and wether the linked document was determined to be valid or not.

If the document is considered valid, the application then uses a trusted wallet to sign a message, which the user can then submit to the _Proof of KYC_ smart contract to receive a non-transferrable NFT, which proves that they've gone through this verification.

## Deployment

> To deploy this project you need access to [Stripe Identity](https://stripe.com/identity), which is currently in a private beta stage.

Firstly, you'll need to deploy the `ProofOfKYC` contract to a chain. You can do this by running `yarn hardhat run scripts/deploy.ts` after setting up the corresponding `.env` variables (`DEPLOYER_PRIVKEY`, `WALLET_PRIVKEY`, `ETHERSCAN_API_KEY`, and `NEXT_PUBLIC_INFURA_ID`). The script should take care of granting the wallet protected by `WALLET_PRIVKEY` the minter role.

Then, you can [deploy the project to Vercel](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fm1guelpf%2Fproof-of-kyc&env=SESSION_KEY,NEXT_PUBLIC_INFURA_ID,STRIPE_WEBHOOK_SECRET,NEXT_PUBLIC_CONTRACT_ADDRESS,WALLET_PRIVKEY,STRIPE_SECRET,NEXT_PUBLIC_STRIPE_KEY&envDescription=More%20details%20about%20where%20to%20get%20this%20variables%20from%20on%20the%20project's%20README.&project-name=proof-of-kyc&repo-name=proof-of-kyc). You'll need to set `SESSION_KEY` to a random 32 character string, `NEXT_PUBLIC_INFURA_ID` to your Infura ID, `NEXT_PUBLIC_CONTRACT_ADDRESS` to the address of your newly-deployed contract, and `NEXT_PUBLIC_STRIPE_KEY`, `STRIPE_SECRET` & `STRIPE_WEBHOOK_SECRET` to your corresponding Stripe credentials.

Finally, you'll need to create a Stripe webhook for the `identity.verification_session.verified`, and point it to `[your_URI]/api/webhooks`.

## Risks

The system proposed here isn't decentralized, since it relies on both Stripe carrying out the verification and redacting personal details afterwards and the deployer, which as mentioned could update the code to remove the bit that redacts your details, or configure additional webhooks that save the users' data to a external database. Vercel can mitigate part of this risk by linking deployments with commits and allowing you to see the source of the currently deployed code, but this still doesn't protect you against additional webhooks, and it adds an additional trust vector on Vercel.

The contract has also not been audited.

## License

This project is open-sourced software licensed under the MIT license. See the [License file](LICENSE.md) for more information.

[^1]: More details on how bad agents could dox users [as a comment on the `webhooks.ts` file](src/pages/api/webhooks.ts#L22-L24).
