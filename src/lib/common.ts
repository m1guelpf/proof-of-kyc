import { Dispatch, SetStateAction } from 'react'
import { loadStripe } from '@stripe/stripe-js/pure'

export const triggerIdentityModal = async (session: { id: string; modalKey: string }, setSessionId: Dispatch<SetStateAction<string>>, setLoading?: Dispatch<SetStateAction<boolean>>) => {
	const stripe = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_KEY)

	const { error } = await stripe.verifyIdentity(session.modalKey)
	if (setLoading) setLoading(false)

	if (error) setSessionId(null)
	else setSessionId(session.id)
}
