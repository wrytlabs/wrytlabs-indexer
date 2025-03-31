import { ponder } from '@/generated';
import { Counter, LeverageMorphoFactory } from '../ponder.schema';
import { erc20Abi } from 'viem';

ponder.on('LeverageMorphoFactory:Created', async ({ event, context }) => {
	const { client } = context;
	const { instance } = event.args;

	const marketParams = await client.readContract({
		address: instance,
		abi: context.contracts.LeverageMorpho.abi,
		functionName: 'market',
	});

	const [loan, collateral, oracle, irm, lltv] = marketParams;

	// ---------------------------------------------------------------------------------------

	const loanDecimals = await client.readContract({
		address: loan,
		abi: erc20Abi,
		functionName: 'decimals',
	});

	const loanName = await client.readContract({
		address: loan,
		abi: erc20Abi,
		functionName: 'name',
	});

	const loanSymbol = await client.readContract({
		address: loan,
		abi: erc20Abi,
		functionName: 'symbol',
	});

	// ---------------------------------------------------------------------------------------

	const collateralDecimals = await client.readContract({
		address: collateral,
		abi: erc20Abi,
		functionName: 'decimals',
	});

	const collateralName = await client.readContract({
		address: collateral,
		abi: erc20Abi,
		functionName: 'name',
	});

	const collateralSymbol = await client.readContract({
		address: collateral,
		abi: erc20Abi,
		functionName: 'symbol',
	});

	// ---------------------------------------------------------------------------------------

	await context.db
		.insert(Counter)
		.values({
			id: 'LeverageMorphoFactory:Created',
			amount: 1n,
		})
		.onConflictDoUpdate((row) => ({
			amount: row.amount + 1n,
		}));

	await context.db.insert(LeverageMorphoFactory).values({
		address: instance,
		createdAt: event.block.timestamp,
		creator: event.transaction.from,
		txHash: event.transaction.hash,
		owner: event.args.owner,
		marketId: event.args.marketId,
		loan,
		loanDecimals,
		loanName,
		loanSymbol,
		collateral,
		collateralDecimals,
		collateralName,
		collateralSymbol,
		oracle,
		irm,
		lltv,
	});
});
