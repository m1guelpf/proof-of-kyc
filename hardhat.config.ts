import 'solidity-coverage'
import '@typechain/hardhat'
import * as dotenv from 'dotenv'
import '@nomiclabs/hardhat-waffle'
import '@nomiclabs/hardhat-ethers'
import '@nomiclabs/hardhat-etherscan'
import { HardhatUserConfig } from 'hardhat/config'

dotenv.config({ path: '.env.local' })

const config: HardhatUserConfig = {
	solidity: {
		compilers: [
			{
				version: '0.8.4',
				settings: {
					optimizer: {
						enabled: true,
						runs: 200,
					},
				},
			},
		],
	},
	networks: {
		hardhat: {},
		mainnet: {
			url: `https://mainnet.infura.io/v3/${process.env.NEXT_PUBLIC_INFURA_ID}`,
			accounts: process.env.DEPLOYER_PRIVKEY !== undefined ? [process.env.DEPLOYER_PRIVKEY] : [],
		},
		kovan: {
			url: `https://kovan.infura.io/v3/${process.env.NEXT_PUBLIC_INFURA_ID}`,
			accounts: process.env.DEPLOYER_PRIVKEY !== undefined ? [process.env.DEPLOYER_PRIVKEY] : [],
		},
		polygon: {
			url: `https://polygon-mainnet.infura.io/v3/${process.env.NEXT_PUBLIC_INFURA_ID}`,
			accounts: process.env.DEPLOYER_PRIVKEY !== undefined ? [process.env.DEPLOYER_PRIVKEY] : [],
		},
		mumbai: {
			url: `https://polygon-mumbai.infura.io/v3/${process.env.NEXT_PUBLIC_INFURA_ID}`,
			accounts: process.env.DEPLOYER_PRIVKEY !== undefined ? [process.env.DEPLOYER_PRIVKEY] : [],
		},
	},
	etherscan: {
		apiKey: process.env.ETHERSCAN_API_KEY,
	},
	paths: {
		sources: './src/contracts',
		tests: './src/tests',
	},
	typechain: {
		outDir: 'src/contracts',
	},
}

export default config
