import Stripe from 'stripe'
import { ethers } from 'ethers'
import handler, { ApiRequest, ApiResponse } from '@/lib/api-handler'

const stripe = new Stripe(process.env.STRIPE_SECRET, { typescript: true } as Stripe.StripeConfig)

export default handler().get(async ({ query: { sessionId }, session }: ApiRequest, res: ApiResponse): Promise<void> => {
	const user = session.get('user')
	if (!user) return res.status(401).send('Unauthenticated.')

	const verificationSession = await stripe.identity.verificationSessions.retrieve(sessionId as string)

	if (verificationSession.metadata.walletAddress != user) return res.status(401).send('Unauthenticated.')

	const wallet = new ethers.Wallet(process.env.WALLET_PRIVKEY)

	res.status(200).send({ status: verificationSession.status, sig: await buildSignature(wallet, user), modalKey: verificationSession.status === 'requires_input' && verificationSession.client_secret })
})

const buildSignature = (web3: ethers.Wallet, walletAddress: string): Promise<string> => {
	return web3._signTypedData(
		{
			name: 'Proof of KYC',
			version: '1',
			chainId: '42',
			verifyingContract: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS,
		},
		{
			Verification: [
				{ name: 'requester', type: 'address' },
				{ name: 'allowed', type: 'bool' },
			],
		},
		{ requester: walletAddress, allowed: true }
	)
}
