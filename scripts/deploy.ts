import { ethers, run } from 'hardhat'

async function main() {
	const ProofOfKYC = await ethers.getContractFactory('ProofOfKYC')
	const minterAddress = await new ethers.Wallet(process.env.WALLET_PRIVKEY).getAddress()
	const contract = await ProofOfKYC.deploy(minterAddress)

	await contract.deployed()

	console.log('Contract deployed to:', contract.address)
	await new Promise(resolve => setTimeout(resolve, 1000))
	console.log(`$ yarn hardhat verify ${contract.address} ${minterAddress}`)
	run('verify:verify', { address: contract.address, constructorArguments: [minterAddress] })
}

main()
	.then(() => process.exit(0))
	.catch(error => {
		console.error(error)
		process.exitCode = 1
	})
