import { createConfig } from '@ponder/core';
import { Address, http } from 'viem';
import { polygon } from 'viem/chains';

import { ADDRESS, Membership } from '@wrytlabs/core';

const chain = polygon;

const CONFIG = {
	[polygon.id]: {
		rpc: process.env.RPC_URL_POLYGON ?? polygon.rpcUrls.default.http[0],
		startBlockA: 62135050,
		startBlockB: 62135060,
		blockrange: undefined,
		maxRequestsPerSecond: 5,
		pollingInterval: 5_000,
	},
};

export default createConfig({
	networks: {
		[chain.name]: {
			chainId: chain.id,
			maxRequestsPerSecond: CONFIG[chain!.id].maxRequestsPerSecond,
			pollingInterval: CONFIG[chain!.id].pollingInterval,
			transport: http(CONFIG[chain!.id].rpc),
		},
	},
	contracts: {
		Membership: {
			network: chain.name,
			abi: Membership,
			address: ADDRESS[chain!.id]!.membership as Address,
			startBlock: CONFIG[chain!.id].startBlockA,
			maxBlockRange: CONFIG[chain!.id].blockrange,
		},
	},
});
