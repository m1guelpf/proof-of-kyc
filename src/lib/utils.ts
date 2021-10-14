import { ethers } from 'ethers'

export const personalSignMessage = async (web3: ethers.providers.Web3Provider, message: string): Promise<string> => {
	return web3.getSigner().provider.send('personal_sign', [message, await web3.getSigner().getAddress()])
}
