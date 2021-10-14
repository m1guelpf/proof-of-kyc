import { providers } from 'ethers'
import ConnectWallet from '../ConnectWallet'
import { Dispatch, FC, SetStateAction } from 'react'
import { ProofOfKYC__factory as ProofOfKYC } from '@/contracts/factories/ProofOfKYC__factory'

const MintState: FC<{ web3: providers.Web3Provider; setWeb3: Dispatch<SetStateAction<providers.Web3Provider>>; sessionStatus: { status: string; modalKey?: string; sig?: string } }> = ({ web3, setWeb3, sessionStatus }) => {
	const mintToken = async () => {
		const contract = ProofOfKYC.connect(process.env.NEXT_PUBLIC_CONTRACT_ADDRESS, web3.getSigner())

		try {
			const transaction = await contract.functions.mint(sessionStatus.sig)
			window.open(`https://kovan.etherscan.io/tx/${transaction.hash}`)
		} catch (error) {
			alert('Something went wrong! Are you trying to mint more than one certificate?')
		}
	}

	return (
		<div className="flex flex-col items-center justify-center min-h-screen space-y-6">
			<ConnectWallet className="border-2 py-1 px-2 border-gray-700 hover:bg-gray-100 transition text-lg absolute top-4 right-4" web3={web3} setWeb3={setWeb3}>
				Connect Wallet
			</ConnectWallet>
			<h1 className="text-7xl font-bold text-gray-900">Proof of KYC</h1>
			<p className="text-2xl font-medium max-w-prose mx-auto text-center">You're done! Now, let's mint your certificate.</p>
			<p className="text-xl font-medium max-w-prose mx-auto text-center text-gray-500">(we've also deleted all your records from Stripe's database btw)</p>
			<button onClick={mintToken} className="border-2 py-1 px-2 border-gray-700 hover:bg-gray-100 transition text-xl">
				Mint my Certificate
			</button>
		</div>
	)
}

export default MintState
