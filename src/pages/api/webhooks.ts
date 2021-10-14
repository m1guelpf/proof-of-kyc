import Stripe from 'stripe'
import { buffer } from 'micro'
import handler, { ApiRequest, ApiResponse } from '@/lib/api-handler'

const stripe = new Stripe(process.env.STRIPE_SECRET, { typescript: true } as Stripe.StripeConfig)

export default handler().post(async (req: ApiRequest, res: ApiResponse): Promise<void> => {
	let event: Stripe.Event

	try {
		event = stripe.webhooks.constructEvent(await buffer(req), req.headers['stripe-signature'], process.env.STRIPE_WEBHOOK_SECRET)
	} catch (err) {
		// On error, log and return the error message
		console.log(`❌ Error message: ${err.message}`)
		return res.status(400).send(`Webhook Error: ${err.message}`)
	}

	if (event.type !== 'identity.verification_session.verified') return res.json({ received: true })

	const session = event.data.object as Stripe.Identity.VerificationSession

	// We don't want to be able to access any information about the user, now or ever, so we immediately redact their information.
	// Note that the operator could set up additional webhooks, which would allow them to expand the user info immediately.
	// There's also a small window of time during which the user's info might be visible from the Stripe Dashboard.
	await stripe.identity.verificationSessions.redact(session.id)

	res.json({ received: true })
})

export const config = {
	api: {
		bodyParser: false,
	},
}
