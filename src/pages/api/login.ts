import crypto from 'crypto'
import { recoverPersonalSignature } from 'eth-sig-util'
import handler, { ApiRequest, ApiResponse } from '@/lib/api-handler'

export default handler()
	.get(async (req: ApiRequest, res: ApiResponse) => {
		const nonce = crypto.randomInt(111111, 999999)
		req.session.set('nonce', nonce)
		await req.session.save()

		res.end(buildMessage(nonce))
	})
	.post(async ({ body: { walletAddress, signature }, session }: ApiRequest, res: ApiResponse) => {
		if (walletAddress.toLowerCase() !== recoverPersonalSignature({ data: buildMessage(session.get('nonce')), sig: signature }).toLowerCase()) {
			return res.status(401).send('Unauthenticated.')
		}

		session.unset('nonce')
		session.set('user', walletAddress)
		await session.save()

		res.end()
	})

const buildMessage = (nonce: number): string => `Hey! Sign this message to prove you have access to this wallet. This won't cost you anything.\n\nSecurity code (you can ignore this): ${nonce}`
