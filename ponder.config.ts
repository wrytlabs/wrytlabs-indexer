import { createConfig } from '@ponder/core';
import { Address, http } from 'viem';
import { mainnet, polygon } from 'viem/chains';

import { ADDRESS, MembershipABI, MembershipFactoryABI } from '@wrytlabs/manager-core';

// mainnet (default) or polygon
export const chain = (process.env.PONDER_PROFILE as string) == 'polygon' ? polygon : mainnet;
export const Id = chain.id;
export const ADDR = ADDRESS[chain.id]!;

export const CONFIG = {
	[mainnet.id]: {
		rpc: process.env.RPC_URL_MAINNET ?? mainnet.rpcUrls.default.http[0],
		blockrange: undefined,
		maxRequestsPerSecond: 5,
		pollingInterval: 5_000,
	},
	[polygon.id]: {
		rpc: process.env.RPC_URL_POLYGON ?? polygon.rpcUrls.default.http[0],
		blockrange: undefined,
		maxRequestsPerSecond: 5,
		pollingInterval: 5_000,
	},
};

export const START = {
	[mainnet.id]: {
		membership: 0,
	},
	[polygon.id]: {
		membership: 65794269,
	},
};

export const FACTORY = {
	Membership: MembershipFactoryABI.find((a) => a.type === 'event' && a.name === 'Created'),
};

if (FACTORY.Membership === undefined) throw new Error('Membership Factory Event not found.');

export default createConfig({
	networks: {
		[chain.name]: {
			chainId: chain.id,
			maxRequestsPerSecond: CONFIG[Id].maxRequestsPerSecond,
			pollingInterval: CONFIG[Id].pollingInterval,
			transport: http(CONFIG[Id].rpc),
		},
	},
	contracts: {
		MembershipFactory: {
			network: chain.name,
			abi: MembershipFactoryABI,
			address: ADDR.membershipFactory,
			startBlock: START[Id].membership,
			maxBlockRange: CONFIG[Id].blockrange,
		},
		Membership: {
			network: chain.name,
			abi: MembershipABI,
			factory: {
				address: ADDR.membershipFactory as Address,
				event: FACTORY!.Membership,
				parameter: 'membership',
			},
			startBlock: START[Id].membership,
			maxBlockRange: CONFIG[Id].blockrange,
		},
	},
});
