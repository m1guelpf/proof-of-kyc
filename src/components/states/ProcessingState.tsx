import { providers } from 'ethers'
import ConnectWallet from '../ConnectWallet'
import { triggerIdentityModal } from '@/lib/common'
import { Dispatch, FC, SetStateAction, useEffect } from 'react'

const ProcessingState: FC<{ web3: providers.Web3Provider; setWeb3: Dispatch<SetStateAction<providers.Web3Provider>>; sessionStatus: { status: string; modalKey?: string }; sessionId: string; setSessionId: Dispatch<SetStateAction<string>> }> = ({ web3, setWeb3, sessionStatus, sessionId, setSessionId }) => {
	useEffect(() => {
		if (!sessionStatus) return

		// If the information the user provided wasn't enough for Stripe to verify their identity, we launch the modal again.
		if (sessionStatus.status === 'requires_input') triggerIdentityModal({ id: sessionId, modalKey: sessionStatus.modalKey }, setSessionId)
	}, [sessionStatus])

	return (
		<div className="flex flex-col items-center justify-center min-h-screen space-y-6">
			<ConnectWallet className="border-2 py-1 px-2 border-gray-700 hover:bg-gray-100 transition text-lg absolute top-4 right-4" web3={web3} setWeb3={setWeb3}>
				Connect Wallet
			</ConnectWallet>
			<h1 className="text-7xl font-bold text-gray-900">Proof of KYC</h1>
			<p className="text-2xl font-medium max-w-prose mx-auto text-center">We're now waiting for Stripe to verify your documents.</p>
			<p className="text-xl font-medium max-w-prose mx-auto text-center text-gray-500">(this shouldn't take too long, but feel free to close this tab and come back a bit later!)</p>
			<svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-600 animate-spin" fill="none" viewBox="0 0 24 24" stroke="currentColor">
				<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
			</svg>
		</div>
	)
}

export default ProcessingState
