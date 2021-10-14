import { providers } from 'ethers'
import Web3Modal from 'web3modal'
import WalletConnectProvider from '@walletconnect/web3-provider'
import { ButtonHTMLAttributes, Dispatch, FC, SetStateAction, useEffect, useMemo, useState } from 'react'
import { personalSignMessage } from '@/lib/utils'
import axios from 'axios'

const ConnectWallet: FC<{ web3: providers.Web3Provider; setWeb3: Dispatch<SetStateAction<providers.Web3Provider>> } & ButtonHTMLAttributes<HTMLButtonElement>> = ({ web3, setWeb3, children, ...props }) => {
	const [userAddress, setUserAddress] = useState<string>(null)

	const web3Modal = useMemo<Web3Modal>(() => {
		if (typeof window === 'undefined') return

		return new Web3Modal({
			cacheProvider: true,
			providerOptions: {
				walletconnect: {
					display: {
						description: 'Use Rainbow & other popular wallets',
					},
					package: WalletConnectProvider,
					options: {
						infuraId: process.env.NEXT_PUBLIC_INFURA_ID,
					},
				},
			},
		})
	}, [])

	useEffect(() => {
		if (!web3Modal.cachedProvider) return

		connectWallet()
	}, [])

	useEffect(() => {
		if (!web3) return

		web3.getSigner()
			.getAddress()
			.then(walletAddress => {
				web3.lookupAddress(walletAddress)
					.then(ensName => setUserAddress(ensName))
					.catch(() => setUserAddress(walletAddress))
			})
	}, [web3])

	const connectWallet = () => {
		return web3Modal
			.connect()
			.then(provider => new providers.Web3Provider(provider))
			.then(async provider => {
				// We authenticate with the server using a wallet signature to prevent wallet spoofing.
				if (!JSON.parse(window.localStorage.getItem('auth'))) {
					const signature = await personalSignMessage(provider, (await axios.get('/api/login').then(res => res.data)) as string)

					await axios.post('/api/login', { walletAddress: await provider.getSigner().getAddress(), signature })
					window.localStorage.setItem('auth', JSON.stringify(true))
				}

				setWeb3(provider)
			})
	}

	const disconnectWallet = () => {
		web3Modal.clearCachedProvider()
		window.localStorage.removeItem('auth')
		setWeb3(null)
	}

	return (
		<button onClick={web3 ? disconnectWallet : connectWallet} {...props}>
			{web3 ? (userAddress ? userAddress : 'Disconnect Wallet') : children}
		</button>
	)
}

export default ConnectWallet
