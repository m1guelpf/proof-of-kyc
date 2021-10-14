import { providers } from 'ethers'
import ConnectWallet from '../ConnectWallet'
import { Dispatch, FC, SetStateAction } from 'react'

const InitState: FC<{ web3: providers.Web3Provider; setWeb3: Dispatch<SetStateAction<providers.Web3Provider>> }> = ({ web3, setWeb3 }) => {
	return (
		<div className="flex flex-col items-center justify-center min-h-screen space-y-6">
			<h1 className="text-7xl font-bold text-gray-900">Proof of KYC</h1>
			<p className="text-2xl font-medium">
				An on-chain proof of identity, powered by{' '}
				<a className="underline" href="https://stripe.com/identity" target="_blank">
					Stripe Identity
				</a>
				.
			</p>
			<p className="text-2xl font-medium max-w-prose mx-auto text-center">You'll go through a privacy-friendly identity verification system to prove you're a real human, then we'll issue a non-transferrable NFT to certify you are.</p>
			<p className="text-xl font-medium max-w-prose mx-auto text-center text-gray-500">(don't worry, we'll never access your information, and will remove it from Stripe's databases right after the verification)</p>
			<ConnectWallet className="border-2 py-1 px-2 border-gray-700 hover:bg-gray-100 transition text-lg" web3={web3} setWeb3={setWeb3}>
				Connect your Wallet to begin
			</ConnectWallet>
		</div>
	)
}

export default InitState
