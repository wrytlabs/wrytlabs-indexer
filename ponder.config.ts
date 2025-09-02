import { createConfig } from 'ponder';
import { http } from 'viem';
import { mainnet, polygon } from 'viem/chains';

import { ADDRESS as ADDRESS_MANAGER, MembershipABI, MembershipFactoryABI } from '@wrytlabs/manager-core';
import { ADDRESS as ADDRESS_UTILS, LeverageMorphoABI, LeverageMorphoFactoryABI } from '@wrytlabs/frankencoin-utils';

export const CONFIG = {
	[mainnet.id]: {
		rpc: `https://eth-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_RPC_KEY}`,
		maxRequestsPerSecond: parseInt(process.env.MAX_REQUESTS_PER_SECOND || '50'),
		pollingInterval: 5_000,
	},
	[polygon.id]: {
		rpc: `https://polygon-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_RPC_KEY}`,
		maxRequestsPerSecond: parseInt(process.env.MAX_REQUESTS_PER_SECOND || '50'),
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
	chains: {
		[mainnet.name]: {
			id: mainnet.id,
			maxRequestsPerSecond: CONFIG[mainnet.id].maxRequestsPerSecond,
			pollingInterval: CONFIG[mainnet.id].pollingInterval,
			rpc: http(CONFIG[mainnet.id].rpc),
		},
	},
	contracts: {
		LeverageMorphoFactory: {
			chain: mainnet.name,
			abi: LeverageMorphoFactoryABI,
			address: ADDRESS_UTILS[mainnet.id]!.leverageMorphoFactory,
			startBlock: START[mainnet.id].leverageMorpho,
		},
		LeverageMorpho: {
			chain: mainnet.name,
			abi: LeverageMorphoABI,
			address: {
				address: ADDRESS_UTILS[mainnet.id]!.leverageMorphoFactory,
				event: LeverageMorphoFactory!.Created,
				parameter: 'instance',
			},
			startBlock: START[mainnet.id].leverageMorpho,
		},
	},
});
