import { expect } from 'chai'
import { ethers } from 'hardhat'
import { ProofOfKYC } from '@/contracts/ProofOfKYC'

describe('ProofOfSupport', function () {
	let contract: ProofOfKYC

	beforeEach(async () => {
		const ProofOfKYC = await ethers.getContractFactory('ProofOfKYC')
		contract = (await ProofOfKYC.deploy('0x0000000000000000000000000000000000000000')) as ProofOfKYC
		await contract.deployed()
	})

	it('Playground', async function () {
		console.log(contract)
	})
})
