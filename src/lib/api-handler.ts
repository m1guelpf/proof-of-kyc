import nc from 'next-connect'
import { NextApiRequest, NextApiResponse } from 'next'
import { ironSession, Session } from 'next-iron-session'

const handler = () =>
	nc().use(
		ironSession({
			cookieName: 'next-store',
			password: process.env.SESSION_KEY,
			// if your localhost is served on http:// then disable the secure flag
			cookieOptions: {
				secure: process.env.NODE_ENV === 'production',
			},
		})
	)

export default handler
export type ApiRequest = NextApiRequest & { session: Session }
export type ApiResponse = NextApiResponse
