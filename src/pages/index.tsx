import axios from 'axios'
import useSWR from 'swr'
import { ethers } from 'ethers'
import { FC, useState } from 'react'
import InitState from '@/components/states/InitState'
import MintState from '@/components/states/MintState'
import { useStickyState } from '@/hooks/useStickyState'
import VerifyState from '@/components/states/VerifyState'
import ProcessingState from '@/components/states/ProcessingState'

const Home: FC = () => {
	const [web3, setWeb3] = useState<ethers.providers.Web3Provider>(null)
	const [sessionId, setSessionId] = useStickyState<string>('sessionId', null)

	const { data: sessionStatus } = useSWR(
		() => sessionId && `/api/status?sessionId=${sessionId}`,
		url => axios.get(url).then(res => res.data)
	) as { data: { sig?: string; status: string; modalKey?: string } }

	if (!web3) return <InitState web3={web3} setWeb3={setWeb3} />
	if (!sessionId) return <VerifyState web3={web3} setWeb3={setWeb3} setSessionId={setSessionId} />
	if (sessionStatus?.status != 'verified') return <ProcessingState web3={web3} setWeb3={setWeb3} sessionStatus={sessionStatus} sessionId={sessionId} setSessionId={setSessionId} />

	return <MintState web3={web3} setWeb3={setWeb3} sessionStatus={sessionStatus} />
}

export default Home
