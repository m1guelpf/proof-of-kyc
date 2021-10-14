import Stripe from 'stripe'
import handler, { ApiRequest, ApiResponse } from '@/lib/api-handler'

const stripe = new Stripe(process.env.STRIPE_SECRET, { typescript: true } as Stripe.StripeConfig)

export default handler().post(async ({ session }: ApiRequest, res: ApiResponse): Promise<void> => {
	const user = session.get('user')
	if (!user) return res.status(401).send('Unauthenticated.')

	const verificationSession = await stripe.identity.verificationSessions.create({ type: 'document', metadata: { walletAddress: user } })

	res.status(200).send({ id: verificationSession.id, modalKey: verificationSession.client_secret })
})
