import { createConfig } from '@ponder/core';
import { Address, http, maxUint256 } from 'viem';
import { mainnet, polygon } from 'viem/chains';

import { ADDRESS as ADDRESS_MANAGER, MembershipABI, MembershipFactoryABI } from '@wrytlabs/manager-core';
import { ADDRESS as ADDRESS_UTILS, LeverageMorphoABI, LeverageMorphoFactoryABI } from '@wrytlabs/frankencoin-utils';

// mainnet (default) or polygon
export const chain = (process.env.PONDER_PROFILE as string) == 'polygon' ? polygon : mainnet;
export const Id = chain.id;
export const ADDR = ADDRESS_MANAGER[chain.id]!;

export const CONFIG = {
	[mainnet.id]: {
		rpc: process.env.RPC_URL_MAINNET ?? mainnet.rpcUrls.default.http[0],
		maxRequestsPerSecond: 10,
		pollingInterval: 5_000,
	},
	[polygon.id]: {
		rpc: process.env.RPC_URL_POLYGON ?? polygon.rpcUrls.default.http[0],
		maxRequestsPerSecond: 10,
		pollingInterval: 5_000,
	},
};

export const START = {
	[mainnet.id]: {
		membership: 999999999999,
		leverageMorpho: 22101284,
	},
	[polygon.id]: {
		membership: 65794269,
		leverageMorpho: 0,
	},
};

export const MembershipFactory = {
	Created: MembershipFactoryABI.find((a) => a.type === 'event' && a.name === 'Created'),
};
export const LeverageMorphoFactory = {
	Created: LeverageMorphoFactoryABI.find((a) => a.type === 'event' && a.name === 'Created'),
};

if (MembershipFactory.Created === undefined) throw new Error('Membership Factory Event not found.');
if (LeverageMorphoFactory.Created === undefined) throw new Error('LeverageMorpho Factory Event not found.');

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
		// MembershipFactory: {
		// 	network: 'polygon',
		// 	abi: MembershipFactoryABI,
		// 	address: ADDR.membershipFactory,
		// 	startBlock: START[Id].membership,
		// },
		// Membership: {
		// 	network: 'polygon',
		// 	abi: MembershipABI,
		// 	factory: {
		// 		address: ADDR.membershipFactory as Address,
		// 		event: MembershipFactory!.Created,
		// 		parameter: 'membership',
		// 	},
		// 	startBlock: START[Id].membership,
		// },
		LeverageMorphoFactory: {
			network: chain.name,
			abi: LeverageMorphoFactoryABI,
			address: ADDRESS_UTILS[Id]!.leverageMorphoFactory,
			startBlock: START[Id].leverageMorpho,
		},
		LeverageMorpho: {
			network: chain.name,
			abi: LeverageMorphoABI,
			factory: {
				address: ADDRESS_UTILS[Id]!.leverageMorphoFactory,
				event: LeverageMorphoFactory!.Created,
				parameter: 'instance',
			},
			startBlock: START[Id].leverageMorpho,
		},
	},
});
