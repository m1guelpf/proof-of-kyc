import axios from 'axios'
import { providers } from 'ethers'
import ConnectWallet from '../ConnectWallet'
import { triggerIdentityModal } from '@/lib/common'
import { Dispatch, FC, SetStateAction, useState } from 'react'

const VerifyState: FC<{ web3: providers.Web3Provider; setWeb3: Dispatch<SetStateAction<providers.Web3Provider>>; setSessionId: Dispatch<SetStateAction<string>> }> = ({ web3, setWeb3, setSessionId }) => {
	const [loading, setLoading] = useState<boolean>(false)

	const requestSession = async () => {
		setLoading(true)
		const session = await axios.post('/api/session').then(res => res.data)

		triggerIdentityModal(session as { id: string; modalKey: string }, setSessionId, setLoading)
	}

	return (
		<div className="flex flex-col items-center justify-center min-h-screen space-y-6">
			<ConnectWallet className="border-2 py-1 px-2 border-gray-700 hover:bg-gray-100 transition text-lg absolute top-4 right-4" web3={web3} setWeb3={setWeb3}>
				Connect Wallet
			</ConnectWallet>
			<h1 className="text-7xl font-bold text-gray-900">Proof of KYC</h1>
			<p className="text-2xl font-medium max-w-prose mx-auto text-center">You'll now go through Stripe's secure identity verification flow. Get ready!</p>
			<button disabled={loading} onClick={requestSession} className="border-2 py-1 px-2 border-gray-700 hover:bg-gray-100 transition text-xl disabled:cursor-wait">
				{loading ? 'Loading...' : 'Start Verification'}
			</button>
		</div>
	)
}

export default VerifyState
